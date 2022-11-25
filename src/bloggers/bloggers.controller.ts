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
import { BlogsService } from 'root/blogs/blogs.service';
import { PostExtendedViewModel } from 'root/posts/types';
import { CreateBlogDTO } from 'root/blogs/dto/create-blog.dto';
import { Post as PostModel } from 'root/posts/domain/posts.model';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { CreateBlogPostDTO } from 'root/blogs/dto/create-blog-post.dto';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { convertToBlogViewModel } from 'root/blogs/utils/convertToBlogViewModel';
import { PaginationQuerySanitizerPipe } from 'root/@common/pipes/pagination-query-sanitizer.pipe';
import { convertToExtendedViewPostModel } from 'root/posts/utils/convertToExtendedPostViewModel';

@Controller('blogger/blogs')
@UseGuards(BearerAuthGuard)
export class BloggersController {
  constructor(private blogsService: BlogsService) {}

  @Post()
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
  async deleteBlog(@Param('id') id, @Res() res: Response) {
    const blog = await this.blogsService.findBlogByIdAndDelete(id);

    if (!blog) return res.status(404).send();

    res.status(204).send();
  }
}
