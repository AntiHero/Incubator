import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnyService } from './service.service';
import { Blog } from 'root/blogs/entity/blog.entity';
import { ServiceController } from './service.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [ServiceController],
  providers: [{ provide: AnyService.name, useClass: AnyService }],
})
export class ServiceModule {}
