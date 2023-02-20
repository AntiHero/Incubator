import { v4 as uuidv4 } from 'uuid';
import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

import { fiveMinInMs } from 'root/@core/constants';
import { Roles } from '../types/roles';

class BanInfo {
  @prop({ default: null })
  banDate: Date | null;

  @prop({ default: null })
  banReason: string | null;

  @prop({ default: false })
  isBanned: boolean;
}

class ConfirmationInfo {
  @prop({ default: false })
  isConfirmed: boolean;

  @prop({ default: uuidv4() })
  code: string;

  @prop({ default: Date.now() + fiveMinInMs })
  expDate: number;
}

class PasswordRecovery {
  @prop({ default: null })
  code: string | null;
}

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
  @prop()
  login: string;

  @prop()
  email: string;

  @prop()
  password: string;

  @prop({ default: new BanInfo(), _id: false })
  banInfo: BanInfo;

  @prop({ default: new ConfirmationInfo(), _id: false })
  confirmationInfo: ConfirmationInfo;

  @prop({ default: new PasswordRecovery(), _id: false })
  passwordRecover: PasswordRecovery;

  @prop({ enum: Roles, addNullToEnum: true, default: null })
  role: Roles;
}
