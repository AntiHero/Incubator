import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { FastifyReply } from 'fastify';
import { PostInputModel } from './types';
import { PostsService } from './posts.service';
import { LikePostDTO } from './dto/like-post.dto';
import { PaginationQuery } from 'root/@common/types';
import Paginator from 'root/@common/models/Paginator';
import { CommentViewModel } from 'root/comments/types';
import { Post as PostModel } from './domain/posts.model';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';
import { OPERATION_COMPLITION_ERROR } from 'root/@common/errorMessages';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { convertToExtendedViewPostModel } from './utils/conveertToExtendedPostViewModel';
import { convertToCommentViewModel } from 'root/comments/utils/convertToCommentViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';

@Controller({ path: 'posts', scope: Scope.REQUEST })
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(
    @UserId() userId: string,
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
        userId,
      );

    const items = posts.map(convertToExtendedViewPostModel);

    // for (const item of items) {
    //   delete item.extendedLikesInfo;
    // }

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
  async getPost(
    @UserId() userId: string,
    @Param('id') id,
    @Res() res: Response,
  ) {
    const post = await this.postsService.getExtendedPostInfo(id, userId);

    if (!post) {
      return res.status(404).send();
    }

    const convertedPost = convertToExtendedViewPostModel(post);

    res.type('text/plain').status(200).send(JSON.stringify(convertedPost));
  }

  @Put(':id/like-status')
  @UseGuards(BearerAuthGuard)
  async likePost(
    @Body() body: LikePostDTO,
    @Param('id') id,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const post = await this.postsService.findPostById(id);

    if (!post) return res.status(404).send();

    const login = req.login;
    const userId = req.userId;
    const likeStatus = body.likeStatus;

    const likePost = await this.postsService.likePost(id, {
      login,
      userId,
      likeStatus,
    });

    if (!likePost)
      throw new HttpException(
        OPERATION_COMPLITION_ERROR,
        HttpStatus.SERVICE_UNAVAILABLE,
      );

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
