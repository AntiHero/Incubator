import { PhotoSizeViewModel } from 'root/@core/types';
import { BlogImageDTO, PostImageDTO } from 'root/bloggers/@common/types';

export class ImageConverter {
  static toView(image: BlogImageDTO | PostImageDTO): PhotoSizeViewModel {
    return {
      fileSize: image.size,
      height: image.height,
      width: image.width,
      url: image.url,
    };
  }
}
