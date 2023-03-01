import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import type { BlogImageInputModel } from 'root/bloggers/@common/types';

import { ImageType } from 'root/@core/types/enum';
import { BlogImagesService } from './blog-images.service';
import { createPrefix } from 'root/bloggers/@common/utils';
import { CloudStrategy } from '../strategies/cloud-strategy';

@Injectable()
export class CloudService {
  public constructor(
    private readonly imageService: BlogImagesService,
    private readonly cloudStrategy: CloudStrategy,
  ) {}

  async uploadImage(
    userId: string,
    blogId: string,
    file: Express.Multer.File,
    imageType: ImageType,
  ) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');

    const prefix = createPrefix(userId);
    const fileName = `${timestamp}-${blogId}-${file.originalname}`;

    const metadata = await sharp(file.buffer).metadata();
    const { size, width, height } = metadata;

    if (imageType === ImageType.wallpaper) {
      await this.imageService.deleteBlogWallpapers(blogId);
    }

    const url = await this.cloudStrategy.upload(fileName, file, prefix);

    const imageData: BlogImageInputModel = {
      name: fileName,
      size,
      width,
      height,
      url,
      blogId: Number(blogId),
      type: imageType,
    };

    const createdImage = await this.imageService.create(imageData);

    return createdImage;
  }
}
