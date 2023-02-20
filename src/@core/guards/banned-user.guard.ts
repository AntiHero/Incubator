import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from 'root/users/users.service';

@Injectable()
export class BanGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { loginOrEmail } = request.body;

    const isBanned = (
      await this.usersService.findUserByLoginOrEmail(loginOrEmail)
    )?.banInfo.isBanned;

    if (isBanned) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
