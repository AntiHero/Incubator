import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { CloudStrategy } from './cloud-strategy';
import { YANDEX_CLOUD_ENDPOINT, REGION } from 'root/bloggers/@common/constants';

@Injectable()
export class YandexCloudStrategy extends CloudStrategy {
  private client: S3Client;

  public constructor(private readonly configService: ConfigService) {
    super();

    this.client = new S3Client({
      region: REGION,
      endpoint: YANDEX_CLOUD_ENDPOINT,
      credentials: {
        accessKeyId: this.configService.get<string>(
          'YANDEX_STORAGE_API_KEY_ID',
        ),
        secretAccessKey: this.configService.get<string>(
          'YANDEX_STORAGE_API_KEY',
        ),
      },
    });
  }

  async upload(
    fileName: string,
    file: Express.Multer.File,
    prefix?: string,
  ): Promise<string> {
    const bucketName = this.configService.get<string>('YANDEX_BUCKET_NAME');

    const params = {
      Bucket: bucketName,
      Key: `${prefix}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const putObjectCommand = new PutObjectCommand(params);

    try {
      await this.client.send(putObjectCommand);

      const url =
        `https://${bucketName}.storage.yandexcloud.net` +
        '/' +
        `${prefix}/${fileName}`;

      return url;
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'File loading failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
