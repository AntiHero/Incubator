import { Controller, Get } from '@nestjs/common';

import { AnyService } from './service.service';
import { Service } from 'root/@common/decorators/service.decorator';

@Controller('service')
export class ServiceController {
  @Get('/blogs')
  async getBlogs(@Service(AnyService) service: AnyService) {
    const blogs = await service.getAllBlogs();

    return blogs;
  }
}
