import { Response } from 'express';

import { UsersService } from 'root/users/users.service';
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

import { BanDTO } from './dto/ban.dto';
import { BanUserDTO } from './dto/ban-user.dto';
import { AdminsService } from './admins.service';
import { PaginationQueryType } from 'root/@common/types';
import Paginator from 'root/@common/models/Paginator';
import { BlogsService } from 'root/blogs/blogs.service';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';
import { BlogWithBanInfo, BlogWithExtendedOwnerInfoType } from './types';
import { IdValidationPipe } from 'root/@common/pipes/id-validation.pipe';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';

@Controller('sa/blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly usersService: UsersService,
    private readonly adminsService: AdminsService,
  ) {}

  @Get()
  async getBlogs(
    @Query(PaginationQuerySanitizerPipe) query: PaginationQueryType,
    @Res() res: Response,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    const [blogs, totalCount] = await this.blogsService.findBlogsByQuery({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm,
    });

    const items: BlogWithExtendedOwnerInfoType[] = [];

    for (const blog of blogs) {
      const user = await this.usersService.findUserById(blog.userId);

      const { id, name, description, websiteUrl, createdAt, banInfo } = blog;

      const extendedBlog: BlogWithBanInfo = {
        id,
        name,
        description,
        websiteUrl,
        createdAt,
        banInfo,
        blogOwnerInfo: {
          userId: blog.userId,
          userLogin: user.login,
        },
      };

      items.push(extendedBlog);
    }

    const result = new Paginator(
      Math.ceil(totalCount / pageSize),
      pageNumber,
      pageSize,
      totalCount,
      items,
    );

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Put(':id/ban')
  @UseGuards(BasicAuthGuard)
  async banBlgo(
    @Param('id', IdValidationPipe) id: string,
    @Body() body: BanDTO,
    @Res() res: Response,
  ) {
    const banRes = await this.blogsService.banBlog(id, body.isBanned);

    if (!banRes) return res.status(HttpStatus.SERVICE_UNAVAILABLE).send();

    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put(':id/bind-with-user/:userId')
  @UseGuards(BasicAuthGuard)
  async banUser(
    @Param('id', IdValidationPipe) id: string,
    @Param('userId', IdValidationPipe) userId: string,
    @Body() body: BanUserDTO,
    @Res() res: Response,
  ) {
    const user = await this.adminsService.banUser(id, body);

    if (!user) return res.status(404).send();

    res.status(204).send();
  }
}
