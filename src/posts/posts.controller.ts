import { Controller } from '@nestjs/common';
import { BlogsService } from 'root/blogs/blogs.service';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private blogsService: BlogsService,
  ) {}
}
