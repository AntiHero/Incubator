import { Injectable } from '@nestjs/common';

import { SecurityDeviceDTO } from './types';
import { SecurityDevicesAdapter } from './adapter/mongoose';

@Injectable()
export class SecurityDevicesService {
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesAdapter,
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
    return this.securityDevicesRepository.findAllByQuery({ userId });
  }

  async saveDevice(device: SecurityDeviceDTO) {
    return this.securityDevicesRepository.create(device);
  }

  async getDevice(query: Record<string, any>) {
    return this.securityDevicesRepository.findOneByQuery(query);
  }

  async getDevicesByQuery(query: Record<string, any>) {
    return this.securityDevicesRepository.findAllByQuery(query);
  }

  async createDeviceIfNotExists(newDevice: Partial<SecurityDeviceDTO>) {
    const existingDevices = await this.getDevicesByQuery({
      userId: newDevice.userId,
    });

    for (const device of existingDevices) {
      if (device.title === newDevice.title) {
        await this.securityDevicesRepository.updateOne(
          { deviceId: device.deviceId },
          { lastActiveDate: new Date() },
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
