import { FastifyReply } from 'fastify';
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
} from '@nestjs/common';

import Blog from './domain/blogs.model';
import { BlogsService } from './blogs.service';
import Paginator from 'root/_common/models/Paginator';
import { BlogInputModel, BlogViewModel } from './types';
import { PostBody, PostViewModel } from 'root/posts/types';
import { Post as PostModel } from 'root/posts/domain/posts.model';
import { convertToBlogViewModel } from './utils/convertToBlogViewModel';
import { SortDirectionKeys, SortDirections } from 'root/_common/types/enum';
import { convertToPostViewModel } from 'root/posts/utils/covertToPostViewModel';

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post()
  async saveBlog(@Body() body: BlogInputModel, @Res() res: FastifyReply) {
    const { name, youtubeUrl }: BlogInputModel = body;

    const blog = new Blog(name, youtubeUrl);

    const savedBlog = await this.blogsService.saveBlog(blog);

    res
      .type('text/plain')
      .status(201)
      .send(JSON.stringify(convertToBlogViewModel(savedBlog)));
  }

  @Get()
  async getAllBlogs(@Query() query, @Res() res: FastifyReply) {
    const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
    const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection =
      query.sortDirection === SortDirectionKeys.asc
        ? SortDirections.asc
        : SortDirections.desc;
    const searchNameTerm = query.searchNameTerm
      ? new RegExp(query.searchNameTerm, 'i')
      : /.*/i;

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
  async getBlog(@Param('id') id, @Res() res: FastifyReply) {
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
    @Body() body: BlogInputModel,
    @Res() res: FastifyReply,
  ) {
    const { name, youtubeUrl } = body;

    const updates = { name, youtubeUrl };

    const blog = await this.blogsService.findBlogByIdAndUpate(id, updates);
    console.log(blog, 'after update');
    if (!blog) {
      console.log(404);
      return res.status(404).send();
    }

    console.log(204);
    res
      .type('text/plain')
      .status(204)
      .send(JSON.stringify(convertToBlogViewModel(blog)));
  }

  @Get(':id/posts')
  async getBlogPosts(
    @Param('id') id,
    @Query() query,
    @Res() res: FastifyReply,
  ) {
    const blog = await this.blogsService.findBlogById(id);

    if (!blog) {
      return res.status(404).send();
    }

    const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
    const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection =
      query.sortDirection === SortDirectionKeys.asc
        ? SortDirections.asc
        : SortDirections.desc;
    const searchNameTerm = query.searchNameTerm
      ? new RegExp(query.searchNameTerm, 'i')
      : /.*/i;

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

    const items: PostViewModel[] = posts.map(convertToPostViewModel);

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
    @Body() body: PostBody,
    @Res() res: FastifyReply,
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
      .send(JSON.stringify(convertToPostViewModel(createdPost)));
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id, @Res() res: FastifyReply) {
    const blog = await this.blogsService.findBlogByIdAndDelete(id);

    if (!blog) return res.status(404).send();

    res.status(204).send();
  }
}
