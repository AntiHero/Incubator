import { Injectable, PipeTransform } from '@nestjs/common';
import { UsersService } from 'root/users/users.service';

@Injectable()
export class InjectUsersService implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}
  transform() {
    return this.usersService;
  }
}
