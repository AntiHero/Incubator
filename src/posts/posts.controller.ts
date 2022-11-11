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
} from '@nestjs/common';

import { FastifyReply } from 'fastify';
import { PostInputModel } from './types';
import { PostsService } from './posts.service';
import Paginator from 'root/_common/models/Paginator';
import { CommentViewModel } from 'root/comments/types';
import { Post as PostModel } from './domain/posts.model';
import { SortDirections } from 'root/_common/types/enum';
import { convertToPostViewModel } from './utils/covertToPostViewModel';
import { convertToExtendedViewPostModel } from './utils/conveertToExtendedPostViewModel';
import { convertToCommentViewModel } from 'root/comments/utils/convertToCommentViewModel';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query() query, @Res() res: FastifyReply) {
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortDirection = SortDirections.desc,
    } = query;

    let { searchNameTerm = null } = query;

    searchNameTerm = Boolean(searchNameTerm)
      ? new RegExp(searchNameTerm, 'i')
      : /.*/i;

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
  async getPost(@Param('id') id, @Res() res: FastifyReply) {
    const post = await this.postsService.getExtendedPostInfo(id);

    if (!post) {
      return res.status(404).send();
    }

    const convertedPost = convertToExtendedViewPostModel(post);

    delete convertedPost.extendedLikesInfo;
    // res
    //   .type('text/plain')
    //   .status(200)
    //   .send(JSON.stringify(convertToExtendedViewPostModel(post)));
    res.type('text/plain').status(200).send(JSON.stringify(convertedPost));
  }

  @Put(':id')
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

    res
      .type('text/plain')
      .status(204)
      .send(JSON.stringify(convertToPostViewModel(post)));
  }

  @Delete(':id')
  async deletePost(@Param('id') id, @Res() res: FastifyReply) {
    const post = this.postsService.findPostByIdAndDelete(id);

    if (!post) return res.status(404).send();

    res.status(204).send();
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id') id,
    @Query() query,
    @Res() res: FastifyReply,
  ) {
    const post = await this.postsService.findPostById(id);

    if (!post) {
      return res.status(404).send();
    }

    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortDirection = SortDirections.desc,
    } = query;

    let { searchNameTerm = null } = query;

    searchNameTerm = Boolean(searchNameTerm)
      ? new RegExp(searchNameTerm, 'i')
      : /.*/i;

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
