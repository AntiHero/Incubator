import { BlogImageDTO, BlogImageInputModel } from 'root/bloggers/@common/types';

export abstract class ImageRepository {
  abstract create(image: BlogImageInputModel): Promise<BlogImageDTO>;
  abstract findById(id: string | number): Promise<BlogImageDTO>;
  abstract deleteById(id: string | number): Promise<void | boolean>;
}
