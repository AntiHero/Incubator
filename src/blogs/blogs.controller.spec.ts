import { Test, TestingModule } from '@nestjs/testing';

import { Blog } from './entity/blog.entity';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'root/posts/entity/post.entity';
import { User } from 'root/users/entity/user.entity';
import { BlogsController } from './blogs.controller';
import { BlogsRepository } from './adapter/blogs.repository';
import { Comment } from 'root/comments/entity/comment.entity';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { BlogsQueryRepository } from './adapter/blogs-query.repository';

describe('TestController', () => {
  let controller: BlogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([
          Blog,
          Post,
          User,
          Comment,
          PostLike,
          CommentLike,
        ]),
      ],
      controllers: [BlogsController],
      providers: [BlogsService, BlogsRepository, BlogsQueryRepository],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
