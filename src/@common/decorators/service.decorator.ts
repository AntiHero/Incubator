import { createParamDecorator } from '@nestjs/common';
import { InjectUsersService } from '../pipes/inject-service.pipe';

export const UsersServiceDecorator = () =>
  createParamDecorator(() => {
    return null;
  })(null, InjectUsersService);
