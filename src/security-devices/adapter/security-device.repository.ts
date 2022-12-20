import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SecurityDevice } from '../entity/security-device.entity';
import { SecurityDeviceDTO } from '../types';
import { ConvertSecurityDeviceData } from '../utils/convertSecurityDevice';
import { updateSecurityDeviceQuery } from '../query/update-security-device.query';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectRepository(SecurityDevice)
    private readonly securityDevicesRepository: Repository<SecurityDevice>,
  ) {}
  async create(deviceData: Partial<SecurityDeviceDTO>) {
    try {
      const { title, ip, lastActiveDate, userId } = deviceData;

      const device = (
        await this.securityDevicesRepository.query(
          `
          INSERT INTO security_devices ("title", "ip", "lastActiveDate", "userId", "deviceId",) 
            VALUES ($1, $2, $3, $4, DEFAULT) 
            RETURNING *
        `,
          [title, ip, lastActiveDate || 'NOW()', userId],
        )
      )[0];

      return ConvertSecurityDeviceData.toDTO(device);
    } catch (e) {
      console.log(e);

      return null;
    }
  }

  async deleteAll() {
    await this.securityDevicesRepository.query(`DELETE FROM security_devices`);
  }

  async deleteById(id: string) {
    const deletedId = (
      await this.securityDevicesRepository.query(
        `
        DELETE FROM security_devices WHERE id=$1
          RETURNIG id
      `,
        [id],
      )
    )[0]?.id;

    if (!deletedId) return null;

    return true;
  }

  async deleteOneByQuery(query: Record<string, any>) {
    const { deviceId } = query;

    const deletedId = (
      await this.securityDevicesRepository.query(
        `
        DELETE FROM security_devices WHERE "deviceId"=$1
          RETURNIG id
      `,
        [deviceId],
      )
    )[0]?.id;

    if (!deletedId) return null;

    return true;
  }

  async updateOne(filter: Record<string, any>, updates: Record<string, any>) {
    const { deviceId } = filter;

    const updatedDevice = (
      await this.securityDevicesRepository.query(
        updateSecurityDeviceQuery(updates),
        deviceId,
      )
    )[0];

    return updatedDevice;
  }

  async deleteAllButOne(query: { userId: string; deviceId: string }) {
    const { userId, deviceId } = query;

    await this.securityDevicesRepository.query(
      `
        DELETE FROM security_devices WHERE "userId"=$1 AND "deviceId"!=$2
      `,
      [userId, deviceId],
    );
  }
}
