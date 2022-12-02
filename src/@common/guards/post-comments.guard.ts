import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from 'root/posts/posts.service';
import { BanUsersForBlogService } from 'root/bloggers/ban-user-for-blog.service';

@Injectable()
export class PostCommentsGuard implements CanActivate {
  constructor(
    private readonly banUsersForBlogService: BanUsersForBlogService,
    private readonly postsService: PostsService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.id;
    const userId = request.userId;

    if (userId && postId) {
      const post = await this.postsService.findPostById(postId);

      const blogId = post.blogId;

      const bannedUser = await this.banUsersForBlogService.findBannedUser(
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
