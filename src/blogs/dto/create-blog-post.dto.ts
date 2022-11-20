import { OmitType } from '@nestjs/mapped-types';
import { CreatePostDTO } from 'root/posts/dto/create-post.dto';

export class CreateBlogPostDTO extends OmitType(CreatePostDTO, ['blogId']) {}
