import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from 'root/posts/posts.service';
import { BanUsersByBloggerService } from 'root/bloggers/ban-users.service';

@Injectable()
export class PostCommentsGuard implements CanActivate {
  constructor(
    private readonly postsService: PostsService,
    private readonly banUsersByBloggerService: BanUsersByBloggerService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.id;
    const userId = request.userId;

    if (userId && postId) {
      const post = await this.postsService.findPostById(postId);

      if (!post) {
        throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
      }

      const blogId = post.blogId;

      const bannedUser = await this.banUsersByBloggerService.findBannedUser(
        userId,
        blogId,
      );

      if (bannedUser && bannedUser.isBanned) {
        throw new HttpException('Resource unavailable', HttpStatus.FORBIDDEN);
      }
    }

    return true;
  }
}
