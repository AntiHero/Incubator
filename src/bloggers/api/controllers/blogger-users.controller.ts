import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import Paginator from 'root/@core/models/Paginator';
import { UsersService } from 'root/users/users.service';
import { BlogsService } from 'root/blogs/services/blogs.service';
import { PaginationQueryType } from 'root/@core/types';
import { UserId } from 'root/@core/decorators/user-id.decorator';
import { BearerAuthGuard } from 'root/@core/guards/bearer-auth.guard';
import { IdValidationPipe } from 'root/@core/pipes/id-validation.pipe';
import { BannedUserForEntityViewModel } from 'root/bloggers/@common/types';
import { BanUserForBlogDTO } from 'root/bloggers/application/dtos/ban-user-for-blog.dto';
import { BanUsersByBloggerService } from 'root/bloggers/application/services/ban-users.service';
import { PaginationQuerySanitizerPipe } from 'root/@core/pipes/pagination-query-sanitizer.pipe';
import { convertToBannedUserForEntityViewModel } from 'root/bloggers/@common/utils/convertToBannedUserForEntityViewModel';

@Controller('blogger/users')
@UseGuards(BearerAuthGuard)
export class BloggersUsersController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly usersService: UsersService,
    private readonly banUsersService: BanUsersByBloggerService,
  ) {}

  @Get('blog/:id')
  async getBannedUsersForBlog(
    @UserId() userId: string,
    @Param('id') blogId: string,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQueryType,
    @Res() res: Response,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm } =
      query;

    const blog = await this.blogsService.findBlogById(blogId);

    if (!blog) return res.status(HttpStatus.NOT_FOUND).end();

    if (blog.userId !== userId) return res.status(HttpStatus.FORBIDDEN).end();

    const [bannedUsers, totalCount] =
      await this.banUsersService.findBannedUsersByQuery(blogId, {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchLoginTerm,
      });

    const items: BannedUserForEntityViewModel[] = bannedUsers.map(
      convertToBannedUserForEntityViewModel,
    );

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

    res.type('text/plain').status(HttpStatus.OK).send(JSON.stringify(result));
  }

  @Put(':id/ban')
  async banUserForBlog(
    @UserId() ownerId: string,
    @Param('id', IdValidationPipe) userId: string,
    @Body() body: BanUserForBlogDTO,
    @Res() res: Response,
  ) {
    const { blogId, isBanned, banReason } = body;

    const blog = await this.blogsService.findBlogById(blogId);
    const user = await this.usersService.findUserById(userId);

    if (!blog || !user) return res.status(HttpStatus.NOT_FOUND).end();

    if (blog.userId !== ownerId) return res.status(HttpStatus.FORBIDDEN).end();

    await this.banUsersService.banUser(userId, blogId, isBanned, banReason);

    res.status(HttpStatus.NO_CONTENT).end();
  }
}
