import { Injectable, PipeTransform } from '@nestjs/common';
import { createParamDecorator, Inject } from '@nestjs/common';

export const Service = (service: new (...args: any[]) => any) =>
  createParamDecorator(() => null)(null, factory(service.name));

const factory = (token: string) => {
  @Injectable()
  class ServicePipe implements PipeTransform {
    @Inject(token) service: any;

    transform() {
      return this.service;
    }
  }

  return ServicePipe;
};
