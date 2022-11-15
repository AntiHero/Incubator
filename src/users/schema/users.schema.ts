import { prop } from '@typegoose/typegoose';

export class UserModel {
  @prop({ required: true })
  login: string;

  @prop({ required: true })
  email: string;

  @prop()
  createdAt: Date;
}
