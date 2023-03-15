import {
  HttpException,
  Controller,
  HttpStatus,
  Delete,
  Param,
  Body,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { convertToExtendedViewCommentModel } from 'root/comments/utils/convertToExtendedViewCommentModel';
import { PaginationQuerySanitizerPipe } from 'root/@core/pipes/pagination-query-sanitizer.pipe';
import { convertToCommentViewModel } from 'root/comments/utils/convertToCommentViewModel';
import { convertToExtendedViewPostModel } from './utils/convertToExtendedPostViewModel';
import { PostCommentsGuard } from 'root/@core/guards/post-comments.guard';
import { UserLogin } from 'root/@core/decorators/user-login.decorator';
import { OPERATION_COMPLITION_ERROR } from 'root/@core/error-messages';
import { BearerAuthGuard } from 'root/@core/guards/bearer-auth.guard';
import { CreateCommentDTO } from '../comments/dto/create-comment.dto';
import { BasicAuthGuard } from 'root/@core/guards/basic.auth.guard';
import { UserId } from 'root/@core/decorators/user-id.decorator';
import { Post as PostModel } from './domain/posts.model';
import { PaginationQueryType } from 'root/@core/types';
import { CommentViewModel } from 'root/comments/types';
import { UpdatePostDTO } from './dto/update-post.dto';
import { CreatePostDTO } from './dto/create-post.dto';
import Paginator from 'root/@core/models/Paginator';
import { LikePostDTO } from './dto/like-post.dto';
import { Roles } from 'root/users/types/roles';
import { PostsService } from './posts.service';

@Controller({ path: 'posts', scope: Scope.REQUEST })
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getPosts(
    // @UserId() userId: string,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQueryType,
    @Res() res: Response,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    const [posts, totalCount] =
      await this.postsService.getExtendedPostsInfoByQuery({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
      });

    const items = posts.map(convertToExtendedViewPostModel);

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

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

    const userId = req.userId;

    const likePost = await this.postsService.likePost(
      id,
      {
        likeStatus: body.likeStatus,
      },
      userId,
    );

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

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

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
