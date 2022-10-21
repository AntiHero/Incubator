import { SecurityDevice } from '@/@types';

export const convertToDevice = <T extends SecurityDevice>(doc: T) => ({
  id: String(doc._id),
  ip: doc.ip,
  title: doc.title,
  deviceId: doc.deviceId,
  lastActivated: doc.lastActiveDate.toISOString(),
});
