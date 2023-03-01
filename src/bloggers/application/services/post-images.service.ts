import sharp from 'sharp';
import { uuid } from 'uuidv4';
import { Injectable, Inject } from '@nestjs/common';

import type {
  PostImageDTO,
  PostImageInputModel,
} from 'root/bloggers/@common/types';

import { ImageType } from 'root/@core/types/enum';
import { createPrefix } from 'root/bloggers/@common/utils';
import { CloudStrategy } from '../strategies/cloud-strategy';
import { Repository } from 'root/@core/repositories/post-image.repository';

const MIDDLE_WIDTH = 300;
const SMALL_WIDTH = 149;
const MIDDLE_HEIGHT = 180;
const SMALL_HEIGHT = 96;

@Injectable()
export class PostsImagesService {
  public constructor(
    @Inject('PostImagesRepository')
    private readonly imageRepository: Repository,
    private readonly cloudStrategy: CloudStrategy,
  ) {}
  private async cropFile(
    file: Express.Multer.File,
    dimensions: { width: number; height: number },
  ) {
    const { width, height } = dimensions;

    const buffer = await sharp(file.buffer)
      .resize({
        width,
        height,
      })
      .toBuffer();

    const croppedFile = {
      ...file,
      buffer,
      width,
      height,
    };

    return croppedFile;
  }

  public async uploadImage(
    userId: string,
    postId: string,
    file: Express.Multer.File,
    imageType: ImageType,
  ): Promise<PostImageDTO[]> {
    const result: PostImageDTO[] = [];

    const prefix = createPrefix(userId);
    const fileExt = file.filename.split('.')[1];

    const fileId = uuid();

    const originalImageName = `${fileId}.${fileExt}`;

    let metadata = await sharp(file.buffer).metadata();
    const { size, width, height } = metadata;

    const originalImageUrl = await this.cloudStrategy.upload(
      originalImageName,
      file,
      prefix,
    );

    const imageData: PostImageInputModel = {
      name: originalImageName,
      size,
      width,
      height,
      url: originalImageUrl,
      postId: Number(postId),
      type: imageType,
    };

    const originalImage = await this.imageRepository.create(imageData);

    result.push(originalImage);

    const middleFile = await this.cropFile(file, {
      width: MIDDLE_WIDTH,
      height: MIDDLE_HEIGHT,
    });

    const middleImageName = `${fileId}-middle.${fileExt}`;

    const middleImageUrl = await this.cloudStrategy.upload(
      middleImageName,
      middleFile,
      prefix,
    );

    metadata = await sharp(middleFile.buffer).metadata();
    const { size: middleImageSize } = metadata;

    const middleImageData: PostImageInputModel = {
      name: middleImageName,
      size: middleImageSize,
      width: MIDDLE_WIDTH,
      height: MIDDLE_HEIGHT,
      url: middleImageUrl,
      postId: Number(postId),
      type: imageType,
    };

    const middleImage = await this.imageRepository.create(middleImageData);

    result.push(middleImage);

    const smallFile = await this.cropFile(file, {
      width: SMALL_WIDTH,
      height: SMALL_HEIGHT,
    });

    const smallImageName = `${fileId}-small.${fileExt}`;

    const smallImageUrl = await this.cloudStrategy.upload(
      middleImageName,
      middleFile,
      prefix,
    );

    metadata = await sharp(smallFile.buffer).metadata();
    const { size: smallImageSize } = metadata;

    const smallImageData: PostImageInputModel = {
      name: smallImageName,
      size: smallImageSize,
      width: SMALL_WIDTH,
      height: SMALL_HEIGHT,
      url: smallImageUrl,
      postId: Number(postId),
      type: imageType,
    };

    const smallImage = await this.imageRepository.create(smallImageData);

    result.push(smallImage);

    return result;
  }
}
