import { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { UsersService } from 'root/users/users.service';
import { LoginUserDTO } from 'root/users/dto/login-user.dto';

@Injectable()
export class PasswordAuthorizatinoMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: Request, res: Response, next: (error?: any) => void) {
    const { login, password } = req.body as LoginUserDTO;

    const isValid = await this.usersService.authenticateUser({
      login,
      password,
    });

    if (!isValid) return res.status(401).send();

    next();
  }
}
