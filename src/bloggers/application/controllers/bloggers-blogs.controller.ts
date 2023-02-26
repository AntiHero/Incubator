import {
  Res,
  Body,
  Get,
  Post,
  Put,
  Query,
  Param,
  Delete,
  HttpStatus,
  Controller,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpException,
  Header,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import type {
  BlogImagesViewModel,
  BlogViewModel,
  BlogWithImagesViewModel,
} from 'root/blogs/types';
import type { PaginationQueryType } from 'root/@core/types';

import Blog from 'root/blogs/domain/blogs.model';
import { fiveMinInMs } from 'root/@core/constants';
import Paginator from 'root/@core/models/Paginator';
import { PostsService } from 'root/posts/posts.service';
import { BlogsService } from 'root/blogs/blogs.service';
import { PostExtendedViewModel } from 'root/posts/types';
import { CloudService } from '../services/cloud.service';
import { CreateBlogDTO } from 'root/blogs/dto/create-blog.dto';
import { UserId } from 'root/@core/decorators/user-id.decorator';
import { Post as PostModel } from 'root/posts/domain/posts.model';
import { BearerAuthGuard } from 'root/@core/guards/bearer-auth.guard';
import { BloggerCommentsViewModel } from 'root/bloggers/@common/types';
import { IdValidationPipe } from 'root/@core/pipes/id-validation.pipe';
import { CreateBlogPostDTO } from 'root/blogs/dto/create-blog-post.dto';
import { convertToBlogViewModel } from 'root/blogs/utils/convertToBlogViewModel';
import { FileTypeValidationPipe } from 'root/@core/pipes/file-type-validation.pipe';
import { FileSizeValidationPipe } from 'root/@core/pipes/file-size-validation.pipe';
import { ParseFileValidationPipe } from 'root/bloggers/@common/pipes/parse-file.pipe';
import { UpdateBlogPostDTO } from 'root/bloggers/application/dtos/update-blog-post.dto';
import { PaginationQuerySanitizerPipe } from 'root/@core/pipes/pagination-query-sanitizer.pipe';
import { convertToExtendedViewPostModel } from 'root/posts/utils/convertToExtendedPostViewModel';
import { convertToBloggerCommentViewModel } from 'root/bloggers/@common/utils/convertToBloggerCommentsViewModel';

@Controller('blogger/blogs')
@UseGuards(BearerAuthGuard)
export class BloggersBlogsController {
  constructor(
    private readonly cloudService: CloudService,
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'text/plain')
  async saveBlog(@UserId() userId, @Body() body: CreateBlogDTO) {
    const { name, description, websiteUrl } = body;

    const blog = new Blog(name, description, websiteUrl, userId);

    const savedBlog = await this.blogsService.saveBlog(blog);

    const blogsViewModel: BlogViewModel = convertToBlogViewModel(savedBlog);

    const result: BlogWithImagesViewModel = {
      ...blogsViewModel,
      images: {
        wallpaper: null,
        main: [],
      },
    };

    return JSON.stringify(result);
  }

  @Get()
  async getAllBlogs(
    @UserId() userId: string,
    @Query(PaginationQuerySanitizerPipe) query,
    @Res() res: Response,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    const [blogs, totalCount] = await this.blogsService.findUserBlogsByQuery(
      userId,
      {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
      },
    );

    const items: BlogViewModel[] = blogs.map(convertToBlogViewModel);

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

    res.type('text/plain').status(200).send(JSON.stringify(result));
  }

  @Get('comments')
  async getComments(
    @UserId() userId: string,
    @Query(PaginationQuerySanitizerPipe) query: PaginationQueryType,
    @Res() res: Response,
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const [comments, totalCount] = await this.blogsService.getAllComments(
      userId,
      {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
      },
    );

    const items: BloggerCommentsViewModel[] = comments.map((comment) =>
      convertToBloggerCommentViewModel(comment),
    );

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

    res.type('text/plain').status(HttpStatus.OK).send(JSON.stringify(result));
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
    @Param('postId', IdValidationPipe) postId: string,
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

  @Post(':id/images/wallpaper')
  @UseInterceptors(FileInterceptor('file'))
  async addWallpaper(
    @UserId() userId: string,
    @Param('id') blogId: string,
    @UploadedFile(
      ParseFileValidationPipe({
        fileType: '.(png|jpeg|jpg)',
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    const blog = await this.blogsService.findBlogById(blogId);

    if (!blog) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (blog.userId !== userId)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const uploadedImage = await this.cloudService.uploadImage('1', file);

    return uploadedImage;
  }

  @Post(':id/images/main')
  @UseInterceptors(FileInterceptor('file'))
  async addMainImage(
    // @UploadedFile(
    //   ParseFileValidationPipe({
    //     fileType: '.(png|jpeg|jpg)',
    //   }),
    // )
    // file: Express.Multer.File,
    @UploadedFile(
      ParseFileValidationPipe({
        fileType: '.(png|jpeg|jpg)',
      }),
      // new FileSizeValidationPipe(),
      // new FileTypeValidationPipe('jpeg', 'jpg', 'png'),
    )
    file: Express.Multer.File,
  ) {
    return 0;
  }
}
