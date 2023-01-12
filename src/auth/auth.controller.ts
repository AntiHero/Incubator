import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Headers,
  UsePipes,
  UseGuards,
  HttpCode,
  Ip,
  Header,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { CodeDTO } from './dto/code.dto';
import { EmailDTO } from './dto/email.dto';
import { UserInfoType } from 'root/users/types';
import { User } from 'root/users/models/user.model';
import { NewPasswordDTO } from './dto/new-password.dto';
import { UsersService } from 'root/users/users.service';
import { TokensService } from 'root/tokens/tokens.service';
import { LoginUserDTO } from 'root/users/dto/login-user.dto';
import { LoginSuccessViewModel, UserForToken } from './types';
import { CreateUserDto } from 'root/users/dto/create-user.dto';
import { BanGuard } from 'root/@common/guards/banned-user.guard';
import { JwtAuthGuard } from 'root/@common/guards/jwt-auth.guard';
import { SecurityDeviceInput } from 'root/security-devices/types';
import { IpRestrictionGuard } from 'root/@common/guards/ip-restriction.guard';
import { AuthenticationGuard } from 'root/@common/guards/authentication.guard';
import { ConfirmUserUseCase } from 'root/users/use-cases/confirm-user.use-case';
import { SecurityDevicesService } from 'root/security-devices/security-devices.service';
import { UpdateUserPasswordUseCase } from 'root/users/use-cases/update-password.use-case';
import { UserUnicityValidationPipe } from 'root/@common/pipes/user-unicity-validation.pipe';
import { RegistrationCodeValidationPipe } from 'root/@common/pipes/registration-code-validation.pipe';
import { ConfirmationStatusValidationPipe } from 'root/@common/pipes/confirmation-status-validation.pipe';
import { UpdateUserPasswordDecorator } from 'root/@common/decorators/update-user-password-use-case.decorator';
import { GetUserByConfirmationCodeUseCase } from 'root/users/use-cases/find-user-by-confirmation-code.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly confirmUserService: ConfirmUserUseCase,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly getUserByConfirmationCodeUseCase: GetUserByConfirmationCodeUseCase,
  ) {}
  @Post('password-recovery')
  async passwordRecovery(@Body() body: EmailDTO, @Res() res: Response) {
    const { email } = body;

    const user = await this.usersService.findUserByLoginOrEmail(email);

    if (user) {
      const { id, email } = user;
      await this.usersService.sendRecoveryEmail(id, email);
    }

    res.status(204).send();
  }

  @Post('new-password')
  async newPassword(
    @Body()
    body: NewPasswordDTO,
    @UpdateUserPasswordDecorator()
    updateUserPasswordUseCase: UpdateUserPasswordUseCase,
    @Res()
    res: Response,
  ) {
    const { recoveryCode, newPassword } = body;

    await updateUserPasswordUseCase.execute(recoveryCode, newPassword);

    res.status(204).send();
  }

  @Post('login')
  @UseGuards(IpRestrictionGuard, AuthenticationGuard, BanGuard)
  async login(
    @Body() body: LoginUserDTO,
    @Res() res: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const { loginOrEmail } = body;

    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail);

    if (!user) res.status(503).send();

    const userId = user.id;

    const newDevice: SecurityDeviceInput = {
      ip,
      lastActiveDate: new Date().toString(),
      title: userAgent || 'unknown',
      userId,
    };

    const login = user.login;

    const deviceId = await this.securityDevicesService.createDeviceIfNotExists(
      newDevice,
    );

    const userForToken: UserForToken = {
      login,
      userId,
      deviceId,
    };

    const [token, refreshToken] = await this.usersService.createTokensPair(
      userForToken,
    );

    const payload: LoginSuccessViewModel = { accessToken: token };

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).type('text/plain').send(payload);
  }

  @Post('refresh-token')
  async refreshToken(@Res() res: Response, @Req() req: Request) {
    const user = await this.usersService.findUserById(req.userId);

    if (!user) return res.status(404).send();

    const userForToken: UserForToken = {
      login: user.login,
      userId: req.userId,
      deviceId: req.deviceId,
    };

    const [token, refreshToken] = await this.usersService.createTokensPair(
      userForToken,
    );

    const payload = { accessToken: token };

    await this.tokensService.saveToken({
      token: req.cookies.refreshToken,
      expDate: new Date(req.expDate * 1000).toISOString(),
    });

    await this.securityDevicesService.updateDevice(
      { deviceId: req.deviceId },
      { lastActiveDate: new Date().toISOString() },
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    res.status(200).type('text/plain').send(payload);
  }

  @Post('registration-confirmation')
  @UseGuards(IpRestrictionGuard)
  @UsePipes(RegistrationCodeValidationPipe)
  async registrationConfirmation(@Res() res: Response, @Body() body: CodeDTO) {
    const user = await this.getUserByConfirmationCodeUseCase.execute(body.code);

    await this.confirmUserService.execute(user?.id);

    res.status(204).send();
  }

  @Post('registration')
  @UseGuards(IpRestrictionGuard)
  @UsePipes(UserUnicityValidationPipe)
  async registration(@Body() body: CreateUserDto, @Res() res: Response) {
    const { login, email, password } = body;

    const userEntity = new User({ login, email, password });
    const user = await this.usersService.createUser(userEntity);

    if (user) {
      return res.status(204).send();
    }

    res.status(503).send();
  }

  @Post('registration-email-resending')
  @UseGuards(IpRestrictionGuard)
  @UsePipes(ConfirmationStatusValidationPipe)
  async registrationEmailResending(
    @Res() res: Response,
    @Body() body: EmailDTO,
  ) {
    const { email } = body;

    const user = await this.usersService.findUserByLoginOrEmail(email);

    if (!user) return res.sendStatus(404);

    const userId = user.id;

    await this.usersService.resendConfirmationEmail(userId, email);

    res.sendStatus(204);
  }

  @Post('logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    await this.securityDevicesService.deleteDeviceByQuery({
      deviceId: req.deviceId,
    });

    await this.tokensService.saveToken({
      token: req.cookies.refreshToken,
      expDate: new Date(req.expDate * 1000).toISOString(),
    });

    res.clearCookie('refreshToken');

    res.status(204).send();
  }

  @Get('me')
  @HttpCode(200)
  @Header('Content-Type', 'text/plain')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const user = await this.usersService.findUserById(req.user.userId);

    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    const userView: UserInfoType = {
      email: user.email,
      login: user.login,
      userId: user.id,
    };

    return userView;
  }
}
