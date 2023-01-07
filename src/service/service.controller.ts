import { Controller, Get } from '@nestjs/common';

import { AnyService } from './service.service';
import { ServiceDecorator } from 'root/@common/decorators/service.decorator';

@Controller('service')
export class ServiceController {
  @Get('/blogs')
  async getBlogs(@ServiceDecorator(AnyService) service: AnyService) {
    const blogs = await service.getAllBlogs();

    return blogs;
  }
}
