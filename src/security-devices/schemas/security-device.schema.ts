import { v4 as uuidv4 } from 'uuid';
import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export interface SecurityDeviceModel extends Base {}
export class SecurityDeviceModel {
  @prop()
  ip: string;

  @prop()
  title: string;

  @prop({ default: uuidv4() })
  deviceId: string;

  @prop({ default: new Date() })
  lastActiveDate: Date;

  @prop()
  userId: number;
}
