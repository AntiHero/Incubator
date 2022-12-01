import { Types } from 'mongoose';
import { prop, Ref } from '@typegoose/typegoose';
import { UserModel } from 'root/users/schema/users.schema';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface BannedUserForEntityModel extends Base {}
export class BannedUserForEntityModel extends TimeStamps {
  @prop({ ref: () => UserModel })
  user: Ref<UserModel>;

  @prop({ default: null })
  banReason: string | null;

  @prop()
  entityId: Types.ObjectId;

  @prop({ default: false })
  isBanned: boolean;

  @prop({ default: new Date() })
  banDate: Date;
}
