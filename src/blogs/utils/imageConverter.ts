import { PhotoSizeViewModel } from 'root/@core/types';
import { BlogImageDTO } from 'root/bloggers/@common/types';

export class ImageConverter {
  static toView(image: BlogImageDTO): PhotoSizeViewModel {
    return {
      fileSize: image.size,
      height: image.height,
      width: image.width,
      url: image.url,
    };
  }
}
