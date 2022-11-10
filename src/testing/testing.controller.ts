import { Controller, Delete } from '@nestjs/common';
import { BlogsService } from 'src/blogs/blogs.service';

@Controller('testing')
export class TestingController {
  constructor(private blogsService: BlogsService) {}

  @Delete('all-data')
  async removeAllData() {
    await this.blogsService.deleteAllBlogs();
  }
}
