import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import Blog from 'root/blogs/domain/blogs.model';
import { BlogViewModel } from 'root/blogs/types';
import { PaginationQuery } from 'root/@common/types';
import Paginator from 'root/@common/models/Paginator';
import { PostsService } from 'root/posts/posts.service';
import { BlogsService } from 'root/blogs/blogs.service';
import { PostExtendedViewModel } from 'root/posts/types';
import { UpdateBlogPostDTO } from './update-blog-post.dto';
import { CreateBlogDTO } from 'root/blogs/dto/create-blog.dto';
import { Post as PostModel } from 'root/posts/domain/posts.model';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { CreateBlogPostDTO } from 'root/blogs/dto/create-blog-post.dto';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { convertToBlogViewModel } from 'root/blogs/utils/convertToBlogViewModel';
import { convertToExtendedViewPostModel } from 'root/posts/utils/convertToExtendedPostViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';

@Controller('blogger/blogs')
@UseGuards(BearerAuthGuard)
export class BloggersController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  async saveBlog(
    @UserId() userId: string,
    @Body() body: CreateBlogDTO,
    @Res() res: Response,
  ) {
    const { name, description, websiteUrl } = body;

    const blog = new Blog(name, description, websiteUrl, userId);

    const savedBlog = await this.blogsService.saveBlog(blog);

    res
      .type('text/plain')
      .status(201)
      .send(JSON.stringify(convertToBlogViewModel(savedBlog)));
  }

  @Get()
  async getAllBlogs(
    @UserId() userId: string,
    @Query(PaginationQuerySanitizerPipe) query,
    @Res() res: Response,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    const [blogs = [], totalCount] =
      await this.blogsService.findUserBlogsByQuery(userId, {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
      });

    const items: BlogViewModel[] = blogs.map(convertToBlogViewModel);

    const result = new Paginator(
      Math.ceil(totalCount / pageSize),
      pageNumber,
      pageSize,
      totalCount,
      items,
    );

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Get(':id')
  async getBlog(@Param('id') id, @Res() res: Response) {
    const blog = await this.blogsService.findBlogById(id);

    if (!blog) {
      return res.status(404).send();
    }
    res
      .type('text/plain')
      .status(200)
      .send(JSON.stringify(convertToBlogViewModel(blog)));
  }

  @Put(':id')
  async updateBlog(
    @UserId() userId: string,
    @Param('id') id,
    @Body() body: CreateBlogDTO,
    @Res() res: Response,
  ) {
    const { name, websiteUrl, description } = body;

    const updates = { name, websiteUrl, description };

    const blog = await this.blogsService.findBlogByIdAndUpate(id, updates);

    if (!blog) {
      return res.status(404).send();
    }

    if (blog.userId !== userId) {
      return res.status(403).send();
    }

    res.type('text/plain').status(204).send();
  }

  @Get(':id/posts')
  async getBlogPosts(
    @UserId() userId: string,
    @Param('id') id: string,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQuery,
    @Res() res: Response,
  ) {
    const blog = await this.blogsService.findBlogById(id);

    if (!blog) {
      return res.status(404).send();
    }

    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    const [posts, totalCount] = await this.blogsService.findBlogPostsByQuery(
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

    const items: PostExtendedViewModel[] = posts.map(
      convertToExtendedViewPostModel,
    );

    const result = new Paginator(
      Math.ceil(totalCount / pageSize),
      pageNumber,
      pageSize,
      totalCount,
      items,
    );

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Post(':id/posts')
  async saveBlogPost(
    @UserId() userId: string,
    @Param('id') id,
    @Body() body: CreateBlogPostDTO,
    @Res() res: Response,
  ) {
    const { title, shortDescription, content } = body;

    const blog = await this.blogsService.findBlogById(id);

    if (!blog) {
      return res.status(404).send();
    }

    if (blog.userId !== userId) return res.status(403).send();

    const [blogId, blogName] = [blog.id, blog.name];

    const post = new PostModel({
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    });

    const createdPost = await this.blogsService.addBlogPost(blogId, post);

    res
      .type('text/plain')
      .status(201)
      .send(JSON.stringify(convertToExtendedViewPostModel(createdPost)));
  }

  @Put(':id/posts/:postId')
  async updateBlogPost(
    @UserId() userId: string,
    @Param('id') id: string,
    @Param('postId') postId: string,
    @Body() body: UpdateBlogPostDTO,
    @Res() res: Response,
  ) {
    const { title, shortDescription, content } = body;

    const post = await this.postsService.findPostById(postId);

    if (!post) return res.status(404).send();

    const blog = await this.blogsService.findBlogById(id);

    if (!blog) return res.status(404).send();

    if (blog.userId !== userId || post.blogId !== blog.id)
      return res.status(403).send();

    const updates = { title, shortDescription, content };

    await this.postsService.findPostByIdAndUpate(postId, updates);

    res.type('text/plain').status(204).send();
  }

  @Delete(':id/posts/:postId')
  async deleteBlogPost(
    @UserId() userId: string,
    @Param('postId') postId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const blog = await this.blogsService.findBlogById(id);

    if (!blog) return res.status(404).send();

    if (blog.userId !== userId) {
      return res.status(403).send();
    }

    const post = await this.postsService.findPostByIdAndDelete(postId);

    if (!post) return res.status(404).send();

    if (post.blogId !== blog.id) {
      return res.status(403).send();
    }

    res.status(204).send();
  }

  @Delete(':id')
  async deleteBlog(
    @UserId() userId: string,
    @Param('id') id,
    @Res() res: Response,
  ) {
    const blog = await this.blogsService.findBlogByIdAndDelete(id);

    if (!blog) return res.status(404).send();

    if (blog.userId !== userId) {
      return res.status(403).send();
    }
    res.status(204).send();
  }
}
