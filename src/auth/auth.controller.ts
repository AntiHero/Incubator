import { v4 as uuid } from 'uuid';
import { Request, Response } from 'express';
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
} from '@nestjs/common';

import { EmailDTO } from './dto/email.dto';
import { CodeDTO } from './dto/code.dto';
import { UserInfoType } from 'root/users/types';
import { User } from 'root/users/entity/user.entity';
import { UsersService } from 'root/users/users.service';
import { TokensService } from 'root/tokens/tokens.service';
import { LoginUserDTO } from 'root/users/dto/login-user.dto';
import { LoginSuccessViewModel, UserForToken } from './types';
import { CreateUserDto } from 'root/users/dto/create-user.dto';
import { SecurityDeviceInput } from 'root/security-devices/types';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { SecurityDevicesService } from 'root/security-devices/security-devices.service';
import { UserUnicityValidationPipe } from 'root/@common/pipes/user-unicity-validation.pipe';
import { RegistrationCodeValidationPipe } from 'root/@common/pipes/registration-code-validation.pipe';
import { ConfirmationStatusValidationPipe } from 'root/@common/pipes/confirmation-status-validation.pipe';
import { BanGuard } from 'root/@common/guards/banned-user.guard';
import { JwtAuthGuard } from 'root/@common/guards/jwt-auth.guard';

// const ips: IpsType = {};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly tokensService: TokensService,
  ) {}
  @Post('password-recovery')
  async passwordRecovery(@Res() res: Response) {
    res.status(201).send();
  }

  @Post('new-password')
  async newPassword(@Res() res: Response) {
    res.status(201).send();
  }

  @Post('login')
  @UseGuards(BanGuard)
  async login(
    @Body() body: LoginUserDTO,
    @Req() req: Request,
    @Res() res: Response,
    @Headers('user-agent') userAgent: string,
  ) {
    const ip = req.ip;
    const { loginOrEmail } = body;

    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail);

    if (!user) res.status(503).send();

    const userId = user.id;

    const newDeviceId = uuid();

    const newDevice: SecurityDeviceInput = {
      deviceId: newDeviceId,
      ip,
      lastActiveDate: new Date().toString(),
      title: userAgent || 'unknown',
      userId,
    };

    const login = user.login;

    const existingDeviceId =
      await this.securityDevicesService.createDeviceIfNotExists(newDevice);

    const userForToken: UserForToken = {
      login,
      userId,
      deviceId: existingDeviceId ?? newDeviceId,
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
      expDate: String(req.expDate),
    });

    await this.securityDevicesService.updateDevice(
      { deviceId: req.deviceId },
      { lastActiveDate: new Date() },
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    res.status(200).type('text/plain').send(payload);
  }

  @Post('registration-confirmation')
  @UsePipes(RegistrationCodeValidationPipe)
  async registrationConfirmation(@Res() res: Response, @Body() body: CodeDTO) {
    const user = await this.usersService.findUserByQuery({
      'confirmationInfo.code': body.code,
    });

    await this.usersService.confirmUser(user.id);

    res.status(204).send();
  }

  @Post('registration')
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

    res.status(204).send();
  }

  @Post('logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    await this.securityDevicesService.deleteDeviceByQuery({
      deviceId: req.deviceId,
    });

    await this.tokensService.saveToken({
      token: req.cookies.refreshToken,
      expDate: String(req.expDate),
    });

    res.clearCookie('refreshToken');

    res.status(204).send();
  }

  @Get('me')
  // @UseGuards(BearerAuthGuard)
  @UseGuards(JwtAuthGuard)
  async me(@Res() res: Response, @Req() req: Request) {
    const userId = req.user.userId;

    const user = await this.usersService.findUserById(userId);

    if (!user) res.status(404).send();

    const userView: UserInfoType = {
      email: user.email,
      login: user.login,
      userId: user.id,
    };

    res.status(200).type('text/plain').send(userView);
  }
}
