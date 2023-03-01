import sharp from 'sharp';
import { uuid } from 'uuidv4';
import { Injectable, Inject } from '@nestjs/common';

import type { BlogImageInputModel } from 'root/bloggers/@common/types';

import { ImageType } from 'root/@core/types/enum';
import { createPrefix } from 'root/bloggers/@common/utils';
import { CloudStrategy } from '../strategies/cloud-strategy';
import { Repository } from 'root/@core/repositories/blog-image-repository';

@Injectable()
export class BlogImagesService {
  public constructor(
    @Inject('BlogImagesRepository')
    private readonly imageRepository: Repository,
    private readonly cloudStrategy: CloudStrategy,
  ) {}

  async uploadImage(
    userId: string,
    blogId: string,
    file: Express.Multer.File,
    imageType: ImageType,
  ) {
    // const timestamp = new Date().toISOString().replace(/:/g, '-');

    const prefix = createPrefix(userId);
    // const fileName = `${timestamp}-${blogId}-${file.originalname}`;
    const fileExt = file.originalname.split('.')[1];
    const fileName = `${uuid()}.${fileExt}`;

    const metadata = await sharp(file.buffer).metadata();
    const { size, width, height } = metadata;

    const url = await this.cloudStrategy.upload(fileName, file, prefix);
    // this.cloudStrategy.upload(fileName, file, prefix);

    const imageData: BlogImageInputModel = {
      name: fileName,
      size,
      width,
      height,
      url,
      blogId: Number(blogId),
      type: imageType,
    };

    // const createdImage = await this.imageRepository.create(imageData);
    if (imageType === ImageType.wallpaper) {
      this.imageRepository.deleteAll(blogId, ImageType.wallpaper).then(() => {
        this.imageRepository.create(imageData);
      });
    } else if (imageType === ImageType.main) {
      this.imageRepository.deleteAll(blogId, ImageType.main).then(() => {
        this.imageRepository.create(imageData);
      });
    }

    // this.imageRepository.create(imageData);

    return { size, width, height, url };
    // return createdImage;
  }

  async getImages(blogId: string) {
    return this.imageRepository.getImages(blogId);
  }
}
