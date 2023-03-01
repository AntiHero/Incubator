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
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common/exceptions';

import type { BlogViewModel, BlogWithImagesViewModel } from './types';

import Blog from './domain/blogs.model';
import { Roles } from 'root/users/types/roles';
import Paginator from 'root/@core/models/Paginator';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { PaginationQueryType } from 'root/@core/types';
import { BlogsService } from './services/blogs.service';
import { ImageConverter } from './utils/imageConverter';
import { PostExtendedViewModel } from 'root/posts/types';
import { CreateBlogPostDTO } from './dto/create-blog-post.dto';
import { Post as PostModel } from 'root/posts/domain/posts.model';
import { UserId } from 'root/@core/decorators/user-id.decorator';
import { BasicAuthGuard } from 'root/@core/guards/basic.auth.guard';
import { convertToBlogViewModel } from './utils/convertToBlogViewModel';
import { Header } from '@nestjs/common/decorators/http/header.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import { PaginationQuerySanitizerPipe } from 'root/@core/pipes/pagination-query-sanitizer.pipe';
import { convertToExtendedViewPostModel } from 'root/posts/utils/convertToExtendedPostViewModel';
import { BlogImagesService } from 'root/bloggers/application/services/blog-images-deprecated.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogImagesService: BlogImagesService,
  ) {}

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
    // @Res() res: Response,
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

    return result;
    // res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Get(':id')
  @Header('Content-Type', 'text/plain')
  @HttpCode(HttpStatus.OK)
  async getBlog(@Param('id') id: string) {
    const blog = await this.blogsService.findBlogById(id, Roles.USER);

    if (!blog) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const blogImages = await this.blogImagesService.getImages(blog.id);

    const result: BlogWithImagesViewModel = {
      ...convertToBlogViewModel(blog),
      images: {
        wallpaper:
          blogImages.wallpaper && ImageConverter.toView(blogImages.wallpaper),
        main: blogImages.main.map(ImageConverter.toView),
      },
    };

    return result;
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
