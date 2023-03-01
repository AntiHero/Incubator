import { ImageType } from '../types/enum';
import { BlogImageDTO, BlogImageInputModel } from 'root/bloggers/@common/types';

export abstract class ImageRepository {
  abstract create(image: BlogImageInputModel): Promise<BlogImageDTO>;

  abstract findById(id: string | number): Promise<BlogImageDTO>;

  abstract getImage(
    blogId: string | number,
    imageType: ImageType,
  ): Promise<BlogImageDTO>;

  abstract getImages(
    blogId: string | number,
  ): Promise<{ wallpaper: BlogImageDTO; main: BlogImageDTO[] }>;

  abstract deleteById(id: string | number): Promise<void | boolean>;

  abstract deleteAll(
    blogId?: string | number,
    imageType?: ImageType,
  ): Promise<void>;
}
