import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { FastifyReply } from 'fastify';
import { PostInputModel } from './types';
import { PostsService } from './posts.service';
import { PaginationQuery } from 'root/@common/types';
import Paginator from 'root/@common/models/Paginator';
import { CommentViewModel } from 'root/comments/types';
import { Post as PostModel } from './domain/posts.model';
// import { convertToPostViewModel } from './utils/covertToPostViewModel';
import { convertToExtendedViewPostModel } from './utils/conveertToExtendedPostViewModel';
import { convertToCommentViewModel } from 'root/comments/utils/convertToCommentViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(
    @Query(PaginationQuerySanitizerPipe) query: PaginationQuery,
    @Res() res: FastifyReply,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    const [posts, totalCount] =
      await this.postsService.getExtendedPostsInfoByQuery(
        {
          pageNumber,
          pageSize,
          sortBy,
          sortDirection,
          searchNameTerm,
        },
        {},
      );

    const items = posts.map(convertToExtendedViewPostModel);

    for (const item of items) {
      delete item.extendedLikesInfo;
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

  @Post()
  @UseGuards(BasicAuthGuard)
  async savePost(@Body() body: PostInputModel, @Res() res: FastifyReply) {
    const { title, shortDescription, content, blogId } = body;

    const post = new PostModel({
      title,
      shortDescription,
      content,
      blogId,
      blogName: '',
    });

    const savedPost = await this.postsService.savePost(post);

    res
      .type('text/plain')
      .status(201)
      .send(JSON.stringify(convertToExtendedViewPostModel(savedPost)));
  }

  @Get(':id')
  async getPost(@Param('id') id, @Res() res: Response) {
    const post = await this.postsService.getExtendedPostInfo(id);

    if (!post) {
      return res.status(404).send();
    }

    const convertedPost = convertToExtendedViewPostModel(post);

    // delete convertedPost.extendedLikesInfo;

    res.type('text/plain').status(200).send(JSON.stringify(convertedPost));
  }

  @Put(':id/like-status')
  @UseGuards(BearerAuthGuard)
  async likePost(@Res() res: Response) {
    res.status(204).send();
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  async updatePost(
    @Param('id') id,
    @Body() body: PostInputModel,
    @Res() res: FastifyReply,
  ) {
    const { title, shortDescription, blogId, content } = body;

    const updates = { title, shortDescription, blogId, content };

    const post = await this.postsService.findPostByIdAndUpate(id, updates);

    if (!post) {
      return res.status(404).send();
    }

    res.type('text/plain').status(204).send();
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  async deletePost(@Param('id') id, @Res() res: FastifyReply) {
    const post = await this.postsService.findPostByIdAndDelete(id);

    if (!post) return res.status(404).send();

    res.status(204).send();
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id') id,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQuery,
    @Res() res: FastifyReply,
  ) {
    const post = await this.postsService.findPostById(id);

    if (!post) {
      return res.status(404).send();
    }

    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    // const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
    // const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    // const sortBy = query.sortBy || 'createdAt';
    // const sortDirection =
    //   query.sortDirection === SortDirectionKeys.asc
    //     ? SortDirections.asc
    //     : SortDirections.desc;
    // const searchNameTerm = query.searchNameTerm
    //   ? new RegExp(query.searchNameTerm, 'i')
    //   : /.*/i;

    const [comments, totalCount] =
      await this.postsService.findPostCommentsByQuery(id, {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
      });

    const items: CommentViewModel[] = comments.map(convertToCommentViewModel);

    const result = new Paginator(
      Math.ceil(totalCount / pageSize),
      pageNumber,
      pageSize,
      totalCount,
      items,
    );

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }
}
