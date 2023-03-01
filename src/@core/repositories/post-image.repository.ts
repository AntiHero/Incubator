import { ImageType } from '../types/enum';
import { PostImageDTO, PostImageInputModel } from 'root/bloggers/@common/types';

export abstract class Repository {
  abstract create(image: PostImageInputModel): Promise<PostImageDTO>;

  abstract findById(id: string | number): Promise<PostImageDTO>;

  abstract getImage(
    blogId: string | number,
    imageType: ImageType,
  ): Promise<PostImageDTO>;

  abstract getImages(
    blogId: string | number,
  ): Promise<{ main: PostImageDTO[] }>;

  abstract deleteById(id: string | number): Promise<void | boolean>;

  abstract deleteAll(
    blogId?: string | number,
    imageType?: ImageType,
  ): Promise<void>;
}
