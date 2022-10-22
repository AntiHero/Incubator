import { SecuirityDeviceInput } from '@/@types';
import SecurityRepository from '@/repository/security.repository';
import { convertToDevice } from '@/utils/covnertToDevice';

class SecurityService {
  async terminateAllSessions() {
    await SecurityRepository.deleteAll();
  }

  async terminateAllSessionsButOne(query: { deviceId: string }) {
    await SecurityRepository.deleteAllButOneByDeviceIdQuery(query);
  }

  async getDevicesList() {
    return SecurityRepository.getAll();
  }

  async saveDevice(device: SecuirityDeviceInput) {
    return SecurityRepository.save(device);
  }

  async getDevice(query: Record<string, any>) {
    return SecurityRepository.findOneByQuery(query);
  }

  async getDevicesByQuery(query: Record<string, any>) {
    return SecurityRepository.findAllByQuery(query);
  }

  async createDeviceIfNotExists(newDevice: SecuirityDeviceInput) {
    const existingDevices = await this.getDevicesByQuery({
      userId: newDevice.userId,
    });

    let isCurrentDevice = false;

    for (const deviceFromDb of existingDevices) {
      const device = convertToDevice(deviceFromDb);

      if (device.ip === newDevice.ip && device.title === newDevice.title) {
        isCurrentDevice = true;
        
        await SecurityRepository.updateOne(
          { deviceId: device.deviceId },
          { lastActiveDate: new Date() }
        );

        break;
      }
    }

    if (!existingDevices.length || !isCurrentDevice) {
      return SecurityRepository.save(newDevice);
    }

    return null;
  }

  async deleteDeviceByQuery(query: Record<string, any>) {
    return SecurityRepository.deleteOneByQuery(query);
  }
}

export default new SecurityService();
