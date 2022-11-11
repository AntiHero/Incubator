import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from 'root/users/users.service';
import { BlogsService } from 'src/blogs/blogs.service';

@Controller('testing')
export class TestingController {
  constructor(
    private blogsService: BlogsService,
    private usersSevice: UsersService,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  async removeAllData() {
    await this.blogsService.deleteAllBlogs();
    await this.usersSevice.deleteAllUsers();
  }
}
