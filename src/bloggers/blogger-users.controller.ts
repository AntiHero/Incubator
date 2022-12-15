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

import { PaginationQuery } from 'root/@common/types';
import Paginator from 'root/@common/models/Paginator';
import { BannedUserForEntityViewModel } from './types';
import { UsersService } from 'root/users/users.service';
import { BlogsService } from 'root/blogs/blogs.service';
import { BanUserForBlogDTO } from './dto/ban-user-for-blog.dto';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { BanUsersForBlogService } from './ban-user-for-blog.service';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { SqlIdValidationPipe as IdValidationPipe } from 'root/@common/pipes/id-validation.pipe';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';
import { convertToBannedUserForEntityViewModel } from './utils/convertToBannedUserForEntityViewModel';

@Controller('blogger/users')
@UseGuards(BearerAuthGuard)
export class BloggersUsersController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly usersService: UsersService,
    private readonly banUserService: BanUsersForBlogService,
  ) {}

  @Get('blog/:id')
  async getBannedUsersForBlog(
    @UserId() userId: string,
    @Param('id', IdValidationPipe) blogId: string,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQuery,
    @Res() res: Response,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm } =
      query;

    const blog = await this.blogsService.findBlogById(blogId);

    if (!blog) return res.status(HttpStatus.NOT_FOUND).end();

    if (blog.userId !== userId) return res.status(HttpStatus.FORBIDDEN).end();

    const [bannedUsers, totalCount] =
      await this.banUserService.findBannedUsersByQuery(blogId, {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchLoginTerm,
      });

    const items: BannedUserForEntityViewModel[] = bannedUsers.map(
      convertToBannedUserForEntityViewModel,
    );

    const result = new Paginator(
      Math.ceil(totalCount / pageSize),
      pageNumber,
      pageSize,
      totalCount,
      items,
    );

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

    await this.banUserService.banUser(userId, blogId, isBanned, banReason);

    res.status(HttpStatus.NO_CONTENT).end();
  }
}
