import { IsBoolean } from 'class-validator';
import { NOT_BOOLEAN_ERROR } from 'root/@common/error-messages';

export class UpdatePublishStatusDTO {
  @IsBoolean({ message: NOT_BOOLEAN_ERROR })
  published: boolean;
}
