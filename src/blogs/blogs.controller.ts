import {
  Res,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { Response } from 'express';

import Blog from './domain/blogs.model';
import { BlogViewModel } from './types';
import { BlogsService } from './blogs.service';
import { Roles } from 'root/users/types/roles';
import Paginator from 'root/@common/models/Paginator';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { PaginationQueryType } from 'root/@common/types';
import { PostExtendedViewModel } from 'root/posts/types';
import { CreateBlogPostDTO } from './dto/create-blog-post.dto';
import { Post as PostModel } from 'root/posts/domain/posts.model';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';
import { convertToBlogViewModel } from './utils/convertToBlogViewModel';
import { convertToExtendedViewPostModel } from 'root/posts/utils/convertToExtendedPostViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async saveBlog(@Body() body: CreateBlogDTO, @Res() res: Response) {
    const { name, description, websiteUrl } = body;

    const blog = new Blog(name, description, websiteUrl);

    const savedBlog = await this.blogsService.saveBlog(blog);

    res
      .type('text/plain')
      .status(201)
      .send(JSON.stringify(convertToBlogViewModel(savedBlog)));
  }

  @Get()
  async getAllBlogs(
    @Query(PaginationQuerySanitizerPipe) query,
    @Res() res: Response,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    const [blogs, totalCount] = await this.blogsService.findBlogsByQuery(
      {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
      },
      Roles.USER,
    );

    const items: BlogViewModel[] = blogs.map(convertToBlogViewModel);

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Get(':id')
  async getBlog(@Param('id') id, @Res() res: Response) {
    const blog = await this.blogsService.findBlogById(id, Roles.USER);

    if (!blog) {
      return res.status(404).send();
    }
    res
      .type('text/plain')
      .status(200)
      .send(JSON.stringify(convertToBlogViewModel(blog)));
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  async updateBlog(
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

    res.type('text/plain').status(204).send();
  }

  @Get(':id/posts')
  async getBlogPosts(
    @UserId() userId: string,
    @Param('id') id: string,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQueryType,
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

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  async saveBlogPost(
    @Param('id') id,
    @Body() body: CreateBlogPostDTO,
    @Res() res: Response,
  ) {
    const { title, shortDescription, content } = body;

    const blog = await this.blogsService.findBlogById(id);

    if (!blog) {
      return res.status(404).send();
    }

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

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  async deleteBlog(@Param('id') id, @Res() res: Response) {
    const blog = await this.blogsService.findBlogByIdAndDelete(id);

    if (!blog) return res.status(404).send();

    res.status(204).send();
  }
}
