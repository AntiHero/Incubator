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
import { BanUserForBlogDTO } from './dto/ban-user-for-blog.dto';
import { BanUsersForBlogService } from './ban-user-for-blog.service';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { IdValidationPipe } from 'root/@common/pipes/id-validation.pipe';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';
import { convertToBannedUserForEntityViewModel } from './utils/convertToBannedUserForEntityViewModel';

@Controller('blogger/users')
@UseGuards(BearerAuthGuard)
export class BloggersUsersController {
  constructor(private readonly banUserService: BanUsersForBlogService) {}

  @Get('blog/:id')
  async getBannedUsersForBlog(
    @Param('id', IdValidationPipe) blogId: string,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQuery,
    @Res() res: Response,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm } =
      query;

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
    @Param('id', IdValidationPipe) userId: string,
    @Body() body: BanUserForBlogDTO,
    @Res() res: Response,
  ) {
    const { blogId, isBanned, banReason } = body;

    const banUserRes = await this.banUserService.banUser(
      userId,
      blogId,
      isBanned,
      banReason,
    );

    if (!banUserRes) return res.status(503).end();

    res.status(HttpStatus.NO_CONTENT).end();
  }
}
