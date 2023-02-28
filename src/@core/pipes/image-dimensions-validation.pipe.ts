import sharp from 'sharp';
import { FileValidator, Injectable } from '@nestjs/common';

type ValidationOptions = {
  width: number;
  height: number;
};

@Injectable()
export class ImageDimensionsValidatorPipe extends FileValidator<ValidationOptions> {
  public constructor(options: ValidationOptions) {
    super(options);
  }

  async isValid(file?: Express.Multer.File): Promise<boolean> {
    const { height, width } = await sharp(file.buffer).metadata();

    return (
      height === this.validationOptions.height &&
      width === this.validationOptions.width
    );
  }

  buildErrorMessage(): string {
    return 'Bad dimensions';
  }
}
