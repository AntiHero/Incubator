import { SecurityDevice, h09 } from '@/@types';

export const convertToDevice = <T extends SecurityDevice>(
  doc: T
): h09.DeviceViewModel => ({
  ip: doc.ip,
  title: doc.title,
  deviceId: doc.deviceId,
  lastActiveDate: doc.lastActiveDate.toISOString(),
});
