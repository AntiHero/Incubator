import sharp from 'sharp';
import { Writable } from 'stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bucket, Storage } from '@google-cloud/storage';

import type { BlogImageInputModel } from 'root/bloggers/@common/types';

import { BlogImagesService } from './blog-images.service';
import { ImageType } from 'root/@core/types/enum';

@Injectable()
export class CloudService {
  private bucket: Bucket;

  public constructor(
    private readonly cloudStorage: Storage,
    private readonly configService: ConfigService,
    private readonly imageService: BlogImagesService,
  ) {
    const bucketName = this.configService.get<string>('BUCKET_NAME');

    this.bucket = this.cloudStorage.bucket(bucketName);
    console.log(this.bucket.projectId, 'projectId');
  }

  private async write(writer: Writable, data: Buffer) {
    if (!writer.write(data)) {
      return new Promise((resolve) => {
        writer.once('drain', resolve);
      });
    }
  }

  async uploadImage(blogId: string, file: Express.Multer.File) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');

    const fileName = `${timestamp}-${blogId}-${file.originalname}`;

    const image = this.bucket.file(fileName);

    const stream = image.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.log(err);
    });

    await this.write(stream, file.buffer);
    stream.end();

    const uploadedImage = this.bucket.file(fileName);

    const url = await uploadedImage.getSignedUrl({
      action: 'read',
      expires: '01-01-2100',
    })[0];

    const metadata = await sharp(file.buffer).metadata();
    const { size, width, height } = metadata;

    const imageData: BlogImageInputModel = {
      name: fileName,
      size,
      width,
      height,
      url,
      blogId: Number(blogId),
      type: ImageType.wallpaper,
    };

    const createdImage = await this.imageService.create(imageData);

    return createdImage;
  }
}
