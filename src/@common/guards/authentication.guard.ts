import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginUserDTO } from 'root/users/dto/login-user.dto';
import { UsersService } from 'root/users/users.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { loginOrEmail, password } = req.body as LoginUserDTO;

    const isValid = await this.usersService.authenticateUser(
      loginOrEmail,
      password,
    );

    if (!isValid)
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);

    return true;
  }
}
