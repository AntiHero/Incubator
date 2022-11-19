import { Controller, Delete, HttpCode } from '@nestjs/common';

import { UsersService } from 'root/users/users.service';
import { BlogsService } from 'src/blogs/blogs.service';
import { SecurityDevicesService } from 'root/security-devices/security-devices.service';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly usersSevice: UsersService,
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  async removeAllData() {
    await this.blogsService.deleteAllBlogs();
    await this.usersSevice.deleteAllUsers();
    await this.securityDevicesService.deleteAllDevices();
  }
}
