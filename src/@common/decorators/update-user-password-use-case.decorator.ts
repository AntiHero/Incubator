import { createParamDecorator } from '@nestjs/common';
import { Injectable, PipeTransform } from '@nestjs/common';

import { UpdateUserPasswordUseCase } from 'root/users/use-cases/update-password.use-case';

export const UpdateUserPasswordDecorator = () =>
  createParamDecorator(() => {
    return null;
  })(null, InjectService);

@Injectable()
class InjectService implements PipeTransform {
  constructor(private readonly service: UpdateUserPasswordUseCase) {}
  transform() {
    return this.service;
  }
}
