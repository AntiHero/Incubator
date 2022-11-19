import { LeanDocument, Types } from 'mongoose';

import { SecurityDeviceDTO } from '../types';
import { SecurityDeviceModel } from '../schemas/security-device.schema';

export const convertToSecurityDeviceDTO = <
  T extends LeanDocument<
    SecurityDeviceModel &
      Required<{
        _id: Types.ObjectId;
      }>
  >,
>(
  doc: T,
): SecurityDeviceDTO => ({
  id: String(doc._id),
  ip: doc.ip,
  title: doc.title,
  deviceId: doc.deviceId,
  lastActiveDate: doc.lastActiveDate.toISOString(),
  userId: String(doc.userId),
});
