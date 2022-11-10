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
import { PaginationQuery } from 'root/_common/types';
import Paginator from 'root/_common/models/Paginator';
import { BlogInputModel, BlogViewModel } from './types';
import { SortDirections } from 'root/_common/types/enum';
import { PostBody, PostViewModel } from 'root/posts/types';
import { Post as PostModel } from 'root/posts/domain/posts.model';
import { convertToBlogViewModel } from './utils/convertToBlogViewModel';
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
  async getAllBlogs(@Query() query: PaginationQuery, @Res() res: FastifyReply) {
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

    const [blogs, totalCount] = await this.blogsService.findBlogsByQuery({
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

    if (!blog) {
      return res.status(404).send();
    }

    res
      .type('text/plain')
      .status(200)
      .send(JSON.stringify(convertToBlogViewModel(blog)));
  }

  @Get(':id/posts')
  async getBlogPosts(
    @Param('id') id,
    @Query() query,
    @Res() res: FastifyReply,
  ) {
    const blog = await this.blogsService.findBlogById(id);
    console.log(blog);
    if (!blog) {
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

  @Delete()
  async deleteBlog(@Param('id') id, @Res() res: FastifyReply) {
    const blog = this.blogsService.findBlogByIdAndDelete(id);

    if (!blog) return res.status(404).send();

    res.status(204).send();
  }
}
