import { IsUUID } from 'class-validator';

import { BAD_ID_ERROR } from 'root/@core/error-messages';

const UUID_V = '4';

export class IdDTO {
  @IsUUID(UUID_V, { message: BAD_ID_ERROR })
  id: string;
}
