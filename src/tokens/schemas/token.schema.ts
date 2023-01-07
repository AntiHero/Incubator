import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface TokenModel extends Base {}
export class TokenModel extends TimeStamps {
  @prop()
  token: string;

  @prop()
  expDate: Date;

  @prop({ default: true })
  blackListed: boolean;
}
