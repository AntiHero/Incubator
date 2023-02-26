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
  }

  async uploadImage(blogId: string, file: Express.Multer.File) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');

    const fileName = `${timestamp}-${blogId}-${file.originalname}`;

    const image = this.bucket.file(fileName);

    const stream = image.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.write(file.buffer);
    stream.end();

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', () =>
        reject(
          new HttpException(
            'Uploading image failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        ),
      );
    });

    // const uploadedImage = this.bucket.file(fileName);

    // const url = await uploadedImage.getSignedUrl({
    //   action: 'read',
    //   expires: '01-01-2100',
    // });

    return fileName;
  }
}
