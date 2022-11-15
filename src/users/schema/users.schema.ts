import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class BanInfo {
  @prop({ default: null })
  banDate: Date | null;

  @prop({ default: null })
  banReason: string | null;

  @prop({ default: false })
  isBanned: boolean;
}

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
  @prop()
  login: string;

  @prop()
  email: string;

  @prop({ default: new BanInfo(), _id: false })
  banInfo: BanInfo;
}
