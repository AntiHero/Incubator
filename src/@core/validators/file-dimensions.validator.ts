import { FileValidator } from '@nestjs/common';

import jpg from '../file-types/jpg';
import png from '../file-types/png';

type TypeHandlers = {
  [key: string]: {
    detect(buffer: Buffer): boolean;
    calculate(buffer: Buffer): {
      height: number;
      width: number;
    };
  };
};

const typeHandlers: TypeHandlers = {
  jpeg: jpg,
  jpg: jpg,
  png: png,
};

export class FileDimensionsValidator extends FileValidator<{
  width: number;
  height: number;
}> {
  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    for (const key in typeHandlers) {
      if (file.mimetype.includes(key)) {
        if (typeHandlers[key].detect(file.buffer)) {
          const size = typeHandlers[key].calculate(file.buffer);

          if (
            size.height <= this.validationOptions.height &&
            size.width <= this.validationOptions.width
          ) {
            return true;
          }

          break;
        }
      }
    }

    return false;
  }

  buildErrorMessage(): string {
    return `Validation failed (expected size is ${this.validationOptions.width} x ${this.validationOptions.height} (w x h))`;
  }
}
