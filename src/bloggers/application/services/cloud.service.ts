import sharp from 'sharp';
// import { Writable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { Bucket, Storage } from '@google-cloud/storage';

import type { BlogImageInputModel } from 'root/bloggers/@common/types';

import { ImageType } from 'root/@core/types/enum';
import { BlogImagesService } from './blog-images.service';
import { createPrefix } from 'root/bloggers/@common/utils';
import { ENDPOINT, REGION } from 'root/bloggers/@common/constants';

@Injectable()
export class CloudService {
  // private bucket: Bucket;
  private storageClient: S3Client;

  public constructor(
    // private readonly cloudStorage: Storage,
    private readonly configService: ConfigService,
    private readonly imageService: BlogImagesService,
  ) {
    this.storageClient = new S3Client({
      region: REGION,
      endpoint: ENDPOINT,
      credentials: {
        accessKeyId: this.configService.get<string>(
          'YANDEX_STORAGE_API_KEY_ID',
        ),
        secretAccessKey: this.configService.get<string>(
          'YANDEX_STORAGE_API_KEY',
        ),
      },
    });

    // const bucketName = this.configService.get<string>('YANDEX_BUCKET_NAME');
    // this.bucket = this.cloudStorage.bucket(bucketName);
    //
  }

  // private async write(writer: Writable, data: Buffer) {
  //   if (!writer.write(data)) {
  //     return new Promise((resolve) => {
  //       writer.once('drain', resolve);
  //     });
  //   }
  // }

  async uploadImage(userId: string, blogId: string, file: Express.Multer.File) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');

    const fileName = `${timestamp}-${blogId}-${file.originalname}`;

    const bucketName = this.configService.get<string>('YANDEX_BUCKET_NAME');

    const params = {
      Bucket: bucketName,
      Key: `${createPrefix(userId)}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const putObjectCommand = new PutObjectCommand(params);

    try {
      await this.storageClient.send(putObjectCommand);

      const url =
        `https://${bucketName}.storage.yandexcloud.net` +
        '/' +
        `${createPrefix(userId)}/${fileName}`;
      console.log(url);

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
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Image loading failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // const image = this.bucket.file(fileName);

    // const stream = image.createWriteStream({
    //   resumable: false,
    //   metadata: {
    //     contentType: file.mimetype,
    //   },
    // });

    // stream.on('error', (err) => {
    //   console.log(err);
    // });

    // await this.write(stream, file.buffer);
    // stream.end();

    // const uploadedImage = this.bucket.file(fileName);

    // const url = uploadedImage.publicUrl();
    // (
    //   await uploadedImage.getSignedUrl({
    //     action: 'read',
    //     expires: '01-01-2100',
    //   })
    // )[0];
  }
}
