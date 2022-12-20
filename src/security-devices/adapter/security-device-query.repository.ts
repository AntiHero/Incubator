import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SecurityDevice } from '../entity/security-device.entity';
import { ConvertSecurityDeviceData } from '../utils/convertSecurityDevice';
import { convertToSecurityDeviceDTO } from '../utils/convertToSecurityDeviceDTO';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectRepository(SecurityDevice)
    private readonly securityDevicesRepository: Repository<SecurityDevice>,
  ) {}

  async getAll() {
    const devices = await this.securityDevicesRepository.query(
      `
        SELECT * FROM security_devices
      `,
    );

    return devices.map(ConvertSecurityDeviceData.toDTO);
  }

  async findById(id: string) {
    const device = (
      await this.securityDevicesRepository.query(
        `SELECT * FROM security_devices WHERE id=$1`,
        [id],
      )
    )[0];

    if (!device) return null;

    return convertToSecurityDeviceDTO(device);
  }

  async findByDeviceId(deviceId: string) {
    const device = (
      await this.securityDevicesRepository.query(
        `SELECT * FROM security_devices WHERE "deviceId"=$1`,
        [deviceId],
      )
    )[0];

    if (!device) return null;

    return convertToSecurityDeviceDTO(device);
  }

  async findAllByQuery(query: Record<string, any>) {
    const { userId } = query;

    const devices = await this.securityDevicesRepository.query(
      `
        SELECT * FROM security_devies WHERE "userId"=$1
      `,
      [userId],
    );

    return devices.map(ConvertSecurityDeviceData.toDTO);
  }
}
