import { Injectable } from '@nestjs/common';

import { SecurityDeviceDTO } from './types';
import { SecurityDevicesRepository } from './adapter/security-device.repository';
import { SecurityDevicesQueryRepository } from './adapter/security-device-query.repository';

@Injectable()
export class SecurityDevicesService {
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async terminateAllSessions() {
    await this.securityDevicesRepository.deleteAll();
  }

  async terminateAllSessionsButOne(query: {
    userId: string;
    deviceId: string;
  }) {
    await this.securityDevicesRepository.deleteAllButOne(query);
  }

  async getDevicesList(userId: string) {
    return this.securityDevicesQueryRepository.findAllByQuery({ userId });
  }

  async saveDevice(device: SecurityDeviceDTO) {
    return this.securityDevicesRepository.create(device);
  }

  async getDevice(query: Record<string, any>) {
    const { deviceId } = query;
    return this.securityDevicesQueryRepository.findByDeviceId(deviceId);
  }

  async getDevicesByQuery(query: Record<string, any>) {
    return this.securityDevicesQueryRepository.findAllByQuery(query);
  }

  async createDeviceIfNotExists(newDevice: Partial<SecurityDeviceDTO>) {
    const existingDevices = await this.getDevicesByQuery({
      userId: newDevice.userId,
    });

    for (const device of existingDevices) {
      if (device.title === newDevice.title) {
        await this.securityDevicesRepository.updateOne(
          { deviceId: device.deviceId },
          { lastActiveDate: new Date().toISOString() },
        );

        return device.deviceId;
      }
    }

    await this.securityDevicesRepository.create(newDevice);

    return null;
  }

  async deleteDeviceByQuery(query: Record<string, any>) {
    return this.securityDevicesRepository.deleteOneByQuery(query);
  }

  async updateDevice(filter: Record<string, any>, query: Record<string, any>) {
    return this.securityDevicesRepository.updateOne(filter, query);
  }

  async deleteAllDevices() {
    return this.securityDevicesRepository.deleteAll();
  }
}
