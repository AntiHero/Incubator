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
} from '@nestjs/common';

// import { UserDTO } from 'root/users/types';
// import { IpsType } from 'root/@common/types';
import { UsersService } from 'root/users/users.service';
// import { rateLimit } from 'root/@common/utils/rateLimit';
import { LoginUserDTO } from 'root/users/dto/login-user.dto';
import { LoginSuccessViewModel, UserForToken } from './types';
import { CreateUserDto } from 'root/users/dto/create-user.dto';
// import { MAX_TIMEOUT, RATE_LIMIT } from 'root/@common/constants';
import { SecurityDeviceInput } from 'root/security-devices/types';
import { SecurityDevicesService } from 'root/security-devices/security-devices.service';
import { UserUnicityValidationPipe } from 'root/@common/pipes/user-unicity-validation.pipe';
import { EmailDTO } from './dto/email.dto';

// const ips: IpsType = {};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly securityDevicesService: SecurityDevicesService,
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
  async login(
    @Body() body: LoginUserDTO,
    @Req() req: Request,
    @Res() res: Response,
    @Headers('user-agent') userAgent: string,
  ) {
    const ip = req.ip;
    // const url = req.url;
    const { login } = body;

    // let user: UserDTO;

    // try {
    //   rateLimit(ips, url, ip, RATE_LIMIT, MAX_TIMEOUT);

    //   user = await this.usersService.authenticateUser({
    //     login,
    //     password,
    //   });

    //   if (!user) return res.status(401).send();
    // } catch (e) {
    //   return res.status(429).send();
    // }
    const user = await this.usersService.findUserByLoginOrEmail(login);

    if (!user) res.status(503).send();

    const userId = user.id;

    const newDeviceId = uuid();

    const newDevice: SecurityDeviceInput = {
      ip,
      title: userAgent || 'unknown',
      userId,
    };

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
  async refreshToken(@Res() res: Response) {
    res.status(201).send();
  }

  @Post('registration-confirmation')
  async registrationConfirmation(@Res() res: Response) {
    res.status(201).send();
  }

  @Post('registration')
  @UsePipes(UserUnicityValidationPipe)
  async registration(@Body() body: CreateUserDto, @Res() res: Response) {
    // try {
    //   const ip = req.ip;
    //   const url = req.url;

    //   rateLimit(ips, url, ip, RATE_LIMIT, MAX_TIMEOUT);

    const { login, email, password } = body;

    const user = await this.usersService.saveUser({ login, email, password });

    if (user) {
      return res.status(204).send();
    }
    // } catch (e) {
    //   res.status(429).send();
    // }

    res.status(503).send();
  }

  @Post('registration-email-resending')
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
  async logout(@Res() res) {
    res.status(201).send();
  }

  @Get('me')
  async me(@Res() res) {
    res.status(201).send();
  }
}
