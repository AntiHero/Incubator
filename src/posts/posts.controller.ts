import {
  Body,
  Controller,
  Delete,
  Get,
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

import { Roles } from 'root/users/types/roles';
import { PostsService } from './posts.service';
import { LikePostDTO } from './dto/like-post.dto';
import { CreatePostDTO } from './dto/create-post.dto';
import Paginator from 'root/@common/models/Paginator';
import { UpdatePostDTO } from './dto/update-post.dto';
import { CommentViewModel } from 'root/comments/types';
import { Post as PostModel } from './domain/posts.model';
import { PaginationQueryType } from 'root/@common/types';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';
import { CreateCommentDTO } from '../comments/dto/create-comment.dto';
import { OPERATION_COMPLITION_ERROR } from 'root/@common/error-messages';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { UserLogin } from 'root/@common/decorators/user-login.decorator';
import { PostCommentsGuard } from 'root/@common/guards/post-comments.guard';
import { convertToExtendedViewPostModel } from './utils/convertToExtendedPostViewModel';
import { convertToCommentViewModel } from 'root/comments/utils/convertToCommentViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';
import { convertToExtendedViewCommentModel } from 'root/comments/utils/convertToExtendedViewCommentModel';

@Controller({ path: 'posts', scope: Scope.REQUEST })
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getPosts(
    @UserId() userId: string,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQueryType,
    @Res() res: Response,
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
  async savePost(@Body() body: CreatePostDTO, @Res() res: Response) {
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
    const post = await this.postsService.getExtendedPostInfo(
      id,
      userId,
      Roles.USER,
    );

    if (!post) {
      return res.status(404).end();
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

    const login = req.login as unknown as string;
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
    @Body() body: UpdatePostDTO,
    @Res() res: Response,
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
  async deletePost(@Param('id') id, @Res() res: Response) {
    const post = await this.postsService.findPostByIdAndDelete(id);

    if (!post) return res.status(404).send();

    res.status(204).send();
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id') id: string,
    @UserId() userId: string,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQueryType,
    @Res() res: Response,
  ) {
    const post = await this.postsService.findPostById(id);

    if (!post) {
      return res.status(404).send();
    }

    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    const [comments, totalCount] =
      await this.postsService.findPostCommentsByQuery(
        id,
        {
          pageNumber,
          pageSize,
          sortBy,
          sortDirection,
          searchNameTerm,
        },
        userId,
      );

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

  @Post(':id/comments')
  @UseGuards(BearerAuthGuard, PostCommentsGuard)
  async createComment(
    @UserId() userId: string,
    @UserLogin() userLogin: string,
    @Param('id') id: string,
    @Body() body: CreateCommentDTO,
    @Res() res: Response,
  ) {
    const { content } = body;

    const comment = await this.postsService.addComment(id, {
      content,
      userId,
      userLogin,
    });

    if (!comment) return res.status(404).send();

    const extendedCommentView = convertToExtendedViewCommentModel(comment);

    res
      .status(201)
      .type('text/plain')
      .send(JSON.stringify(extendedCommentView));
  }
}
