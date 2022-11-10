import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsService } from 'src/blogs/blogs.service';

@Controller('testing')
export class TestingController {
  constructor(private blogsService: BlogsService) {}

  @Delete('all-data')
  @HttpCode(204)
  async removeAllData() {
    await this.blogsService.deleteAllBlogs();
  }
}
