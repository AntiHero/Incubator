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

import Blog from './domain/blogs.model';
import { BlogViewModel } from './types';
import { BlogsService } from './blogs.service';
import { PaginationQuery } from 'root/@common/types';
import Paginator from 'root/@common/models/Paginator';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { PostExtendedViewModel } from 'root/posts/types';
import { CreateBlogPostDTO } from './dto/create-blog-post.dto';
import { Post as PostModel } from 'root/posts/domain/posts.model';
import { BasicAuthGuard } from 'root/@common/guards/basic.auth.guard';
import { convertToBlogViewModel } from './utils/convertToBlogViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';
import { convertToExtendedViewPostModel } from 'root/posts/utils/conveertToExtendedPostViewModel';

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

    const [blogs = [], totalCount] = await this.blogsService.findBlogsByQuery({
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
    @Param('id') id,
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
