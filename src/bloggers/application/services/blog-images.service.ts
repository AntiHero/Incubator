import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import type { BlogImageInputModel } from 'root/bloggers/@common/types';

import { ImageType } from 'root/@core/types/enum';
// import { BlogImagesService } from './blog-images.service';
import { createPrefix } from 'root/bloggers/@common/utils';
import { CloudStrategy } from '../strategies/cloud-strategy';
import { ImageRepository } from 'root/@core/repositories/image-repository';

@Injectable()
export class BlogImagesService {
  public constructor(
    // private readonly imageService: BlogImagesService,
    private readonly imageRepository: ImageRepository,
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
      await this.imageRepository.deleteAll(blogId, ImageType.wallpaper);
    }

    if (imageType === ImageType.main) {
      await this.imageRepository.deleteAll(blogId, ImageType.main);
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

    const createdImage = await this.imageRepository.create(imageData);

    return createdImage;
  }
}
