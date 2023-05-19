import {
  Res,
  Get,
  Put,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Header,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  UploadedFile,
  HttpException,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import type {
  BlogImagesViewModel,
  BlogViewModel,
  BlogWithImagesViewModel,
} from 'root/blogs/types';
import type {
  BloggerCommentsViewModel,
  PostImagesViewModel,
} from 'root/bloggers/@common/types';
import type { PaginationQueryType } from 'root/@core/types';

import {
  BLOG_MAIN_HEIGHT,
  BLOG_MAIN_WIDTH,
  BLOG_WP_HEIGHT,
  BLOG_WP_WIDTH,
  POST_MAIN_HEIGHT,
  POST_MAIN_WIDTH,
} from 'root/bloggers/@common/constants';
import Blog from 'root/blogs/domain/blogs.model';
import { ImageType } from 'root/@core/types/enum';
import Paginator from 'root/@core/models/Paginator';
import { PostsService } from 'root/posts/posts.service';
import { PostExtendedViewModel } from 'root/posts/types';
import { CreateBlogDTO } from 'root/blogs/dto/create-blog.dto';
import { ImageConverter } from 'root/blogs/utils/imageConverter';
import { BlogsService } from 'root/blogs/services/blogs.service';
import { UserId } from 'root/@core/decorators/user-id.decorator';
import { Post as PostModel } from 'root/posts/domain/posts.model';
import { BearerAuthGuard } from 'root/@core/guards/bearer-auth.guard';
import { IdValidationPipe } from 'root/@core/pipes/id-validation.pipe';
import { CreateBlogPostDTO } from 'root/blogs/dto/create-blog-post.dto';
import { convertToBlogViewModel } from 'root/blogs/utils/convertToBlogViewModel';
import { ParseFileValidationPipe } from 'root/bloggers/@common/pipes/parse-file.pipe';
import { UpdateBlogPostDTO } from 'root/bloggers/application/dtos/update-blog-post.dto';
import { BlogImagesService } from 'root/bloggers/application/services/blog-images.service';
import { PostsImagesService } from 'root/bloggers/application/services/post-images.service';
import { PaginationQuerySanitizerPipe } from 'root/@core/pipes/pagination-query-sanitizer.pipe';
import { convertToExtendedViewPostModel } from 'root/posts/utils/convertToExtendedPostViewModel';
import { convertToBloggerCommentViewModel } from 'root/bloggers/@common/utils/convertToBloggerCommentsViewModel';
import { UsersService } from 'root/users/users.service';

@Controller('blogger/blogs')
@UseGuards(BearerAuthGuard)
export class BloggersBlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly postImagesService: PostsImagesService,
    private readonly blogImagesService: BlogImagesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'text/plain')
  async saveBlog(@UserId() userId: string, @Body() body: CreateBlogDTO) {
    const { name, description, websiteUrl } = body;

    const user = await this.usersService.findUserById(userId);

    if (!user) throw new NotFoundException();

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
    @Query(PaginationQuerySanitizerPipe) query: PaginationQueryType,
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
  async getBlog(@Param('id') id: string, @Res() res: Response) {
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
    @Param('id') id: string,
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
    console.log(userId, 'userId');
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

  @Post(':id/posts/:postId/images/main')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'text/plain')
  @UseInterceptors(FileInterceptor('file'))
  async addBlogPostMainImage(
    @UserId() userId: string,
    @Param('id') id: string,
    @Param('postId', IdValidationPipe) postId: string,
    @UploadedFile(
      ParseFileValidationPipe({
        fileType: '.(png|jpeg|jpg)',
        minHeight: POST_MAIN_HEIGHT,
        minWidth: POST_MAIN_WIDTH,
      }),
    )
    file: Express.Multer.File,
  ) {
    const blog = await this.blogsService.findBlogById(id);

    if (!blog) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    if (blog.userId !== userId)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const post = await this.postsService.findPostById(postId);

    if (!post) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    const uploadedImages = await this.postImagesService.uploadImage(
      userId,
      post.id,
      file,
      ImageType.main,
    );

    const result: PostImagesViewModel = {
      main: uploadedImages.map(ImageConverter.toView),
    };

    return result;
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
    @Param('id') id: string,
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
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'text/plain')
  @UseInterceptors(FileInterceptor('file'))
  async addWallpaper(
    @UserId() userId: string,
    @Param('id') blogId: string,
    @UploadedFile(
      ParseFileValidationPipe({
        fileType: '.(png|jpeg|jpg)',
        minHeight: BLOG_WP_HEIGHT,
        minWidth: BLOG_WP_WIDTH,
      }),
    )
    file: Express.Multer.File,
  ): Promise<BlogImagesViewModel> {
    const blog = await this.blogsService.findBlogById(blogId);

    if (!blog) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (blog.userId !== userId)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const uploadedImage = await this.blogImagesService.uploadImage(
      userId,
      blog.id,
      file,
      ImageType.wallpaper,
    );

    const result: BlogImagesViewModel = {
      wallpaper: {
        fileSize: uploadedImage.size,
        height: uploadedImage.height,
        url: uploadedImage.url,
        width: uploadedImage.width,
      },
      main: [],
    };

    return result;
  }

  @Post(':id/images/main')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'text/plain')
  @UseInterceptors(FileInterceptor('file'))
  async addMainImage(
    @UserId() userId: string,
    @Param('id') blogId: string,
    @UploadedFile(
      ParseFileValidationPipe({
        fileType: '.(png|jpeg|jpg)',
        minHeight: BLOG_MAIN_HEIGHT,
        minWidth: BLOG_MAIN_WIDTH,
      }),
    )
    file: Express.Multer.File,
  ) {
    const blog = await this.blogsService.findBlogById(blogId);

    if (!blog) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (blog.userId !== userId)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const uploadedImage = await this.blogImagesService.uploadImage(
      userId,
      blog.id,
      file,
      ImageType.main,
    );

    const result: BlogImagesViewModel = {
      wallpaper: null,
      main: [
        {
          fileSize: uploadedImage.size,
          height: uploadedImage.height,
          url: uploadedImage.url,
          width: uploadedImage.width,
        },
      ],
    };

    return result;
  }
}
