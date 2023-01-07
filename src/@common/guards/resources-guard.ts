import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from 'root/users/users.service';

@Injectable()
export class ResourceGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request.userId) {
      const isBanned = (await this.usersService.findUserById(request.userId))
        ?.banInfo.isBanned;

      if (isBanned) {
        throw new HttpException('Resource unavailable', HttpStatus.NOT_FOUND);
      }
    }

    return true;
  }
}
