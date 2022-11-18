import { Response } from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Body, Controller, Get, Post, Req, Res, Scope } from '@nestjs/common';

import { IpsType } from 'root/@common/types';
import { UsersService } from 'root/users/users.service';
import { rateLimit } from 'root/@common/utils/rateLimit';
import { CreateUserDto } from 'root/users/dto/create-user.dto';
import { MAX_TIMEOUT, RATE_LIMIT } from 'root/@common/constants';

const ips: IpsType = {};

@Controller({ path: 'auth', scope: Scope.REQUEST })
export class AuthController {
  constructor(private usersService: UsersService) {}
  @Post('password-recovery')
  async passwordRecovery(@Res() res: Response) {
    res.status(201).send();
  }

  @Post('new-password')
  async newPassword(@Res() res: Response) {
    res.status(201).send();
  }

  @Post('login')
  async login(@Res() res: Response) {
    res.status(201).send();
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
  // @UsePipes(UserUnicityValidationPipe)
  async registration(
    @Body() body: CreateUserDto,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    try {
      const ip = req.ip;
      const url = req.url;

      rateLimit(ips, url, ip, RATE_LIMIT, MAX_TIMEOUT);

      const { login, email, password } = body;

      const user = await this.usersService.saveUser({ login, email, password });

      if (user) {
        res.status(204).send();
      }
    } catch (e) {
      res.status(429).send();
    }

    res.status(503).send();
  }

  @Post('registration-email-resending')
  async registrationEmailResending(@Res() res) {
    res.status(201).send();
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
