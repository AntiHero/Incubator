import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';

import type { StorageConfig } from 'root/@core/types';

import { Bucket, Storage } from '@google-cloud/storage';
import { CloudStrategy } from './cloud-strategy';
import { Writable } from 'stream';

@Injectable()
export class GoogleCloudStrategy extends CloudStrategy {
  private storage: Storage;

  private bucket: Bucket;

  public constructor(private readonly configService: ConfigService) {
    super();
    const StorageConfig: StorageConfig = JSON.parse(
      configService.get<string>('CLOUD_STORAGE_CREDENTIALS'),
    );

    this.storage = new Storage({
      projectId: StorageConfig.project_id,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });
  }

  private async write(writer: Writable, data: Buffer) {
    if (!writer.write(data)) {
      return new Promise((resolve) => {
        writer.once('drain', resolve);
      });
    }
  }

  async upload(
    fileName: string,
    file: Express.Multer.File,
    prefix?: string,
  ): Promise<string> {
    const bucketName = this.configService.get<string>('BUCKET_NAME');
    this.bucket = this.storage.bucket(bucketName);

    try {
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

      /* INVESTIGATE HOW TO CREATE SUBFOLDERS */
      const uploadedImage = this.bucket.file(fileName);

      const url = uploadedImage.publicUrl();
      (
        await uploadedImage.getSignedUrl({
          action: 'read',
          expires: '01-01-2100',
        })
      )[0];

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
