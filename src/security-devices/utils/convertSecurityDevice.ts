import { SecurityDevice } from '../entity/security-device.entity';
import { SecurityDeviceDTO, SecurityDeviceViewModel } from '../types';

export class ConvertSecurityDeviceData {
  static toDTO(securityDevice: SecurityDevice): SecurityDeviceDTO {
    return {
      id: String(securityDevice.id),
      ip: securityDevice.ip,
      title: securityDevice.title,
      deviceId: securityDevice.deviceId,
      lastActiveDate: securityDevice.lastActiveDate.toISOString(),
      userId: String(securityDevice.userId),
    };
  }
  static toViewModel(
    securityDevice: SecurityDeviceDTO,
  ): SecurityDeviceViewModel {
    return {
      ip: securityDevice.ip,
      title: securityDevice.title,
      deviceId: securityDevice.deviceId,
      lastActiveDate: securityDevice.lastActiveDate,
    };
  }
}
