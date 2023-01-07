import { Injectable, PipeTransform } from '@nestjs/common';
import { createParamDecorator, Inject } from '@nestjs/common';

export const ServiceDecorator = (service: new (...args: any[]) => any) =>
  createParamDecorator(() => {
    return null;
  })(null, factory(service.name));

const factory = (token: string) => {
  @Injectable()
  class InjectService implements PipeTransform {
    @Inject(token) service: any;

    transform() {
      return this.service;
    }
  }

  return InjectService;
};
