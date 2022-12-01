import { Controller, Delete, HttpCode } from '@nestjs/common';

import { UsersService } from 'root/users/users.service';
import { BlogsService } from 'src/blogs/blogs.service';
import { TokensService } from 'root/tokens/tokens.service';
import { SecurityDevicesService } from 'root/security-devices/security-devices.service';
import { BanUsersForBlogService } from 'root/bloggers/ban-user-for-blog.service';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly usersSevice: UsersService,
    private readonly tokensService: TokensService,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly bannedUserforBlogService: BanUsersForBlogService,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  async removeAllData() {
    await this.blogsService.deleteAllBlogs();
    await this.usersSevice.deleteAllUsers();
    await this.securityDevicesService.deleteAllDevices();
    await this.tokensService.deleteAllTokens();
    await this.bannedUserforBlogService.deleteAll();
  }
}
