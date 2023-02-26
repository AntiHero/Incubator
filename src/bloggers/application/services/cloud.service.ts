import { Writable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { Bucket, Storage } from '@google-cloud/storage';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CloudService {
  private bucket: Bucket;

  public constructor(
    private readonly cloudStorage: Storage,
    private readonly configService: ConfigService,
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

    stream.on('error', () => {
      throw new HttpException(
        'Uploading image failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    await this.write(stream, file.buffer);
    stream.end();

    console.log('image loaded successfully');

    // const uploadedImage = this.bucket.file(fileName);

    // const url = await uploadedImage.getSignedUrl({
    //   action: 'read',
    //   expires: '01-01-2100',
    // });

    return fileName;
  }
}
