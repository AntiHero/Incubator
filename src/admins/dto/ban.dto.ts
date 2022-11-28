import { IsBoolean } from 'class-validator';

export class BanDTO {
  @IsBoolean()
  isBanned: boolean;
}
