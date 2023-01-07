import { SecurityDeviceDTO, SecurityDeviceViewModel } from '../types';

export const convertToSecurityDeviceViewModel = (
  doc: SecurityDeviceDTO,
): SecurityDeviceViewModel => ({
  ip: doc.ip,
  title: doc.title,
  deviceId: doc.deviceId,
  lastActiveDate: doc.lastActiveDate,
});
