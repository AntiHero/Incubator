import { SecuirityDeviceInput } from '@/@types';
import SecurityRepository from '@/repository/security.repository';
import { convertToDevice } from '@/utils/covnertToDevice';

class SecurityService {
  async terminateAllSessions () {
    await SecurityRepository.deleteAll();
  }

  async terminateAllSessionsButOne (query: { userId: string, deviceId: string }) {
    console.log(query)
    await SecurityRepository.deleteAllButOne(query);
  }

  async getDevicesList (userId: string) {
    return SecurityRepository.findAllByQuery({ userId });
  }

  async saveDevice (device: SecuirityDeviceInput) {
    return SecurityRepository.save(device);
  }

  async getDevice (query: Record<string, any>) {
    return SecurityRepository.findOneByQuery(query);
  }

  async getDevicesByQuery (query: Record<string, any>) {
    return SecurityRepository.findAllByQuery(query);
  }

  async createDeviceIfNotExists (newDevice: SecuirityDeviceInput) {
    const existingDevices = await this.getDevicesByQuery({
      userId: newDevice.userId,
    });

    console.log(existingDevices, 'existingDevices');
    for (const deviceFromDb of existingDevices) {
      const device = convertToDevice(deviceFromDb);

      console.log(device.title, newDevice.title, device.deviceId);
      console.log(device.title === newDevice.title);
      if (device.title === newDevice.title) {
        await SecurityRepository.updateOne(
          { deviceId: device.deviceId },
          { lastActiveDate: new Date() }
        );

        return device.deviceId;
      }
    }

    await SecurityRepository.save(newDevice);

    return null;
  }

  async deleteDeviceByQuery (query: Record<string, any>) {
    return SecurityRepository.deleteOneByQuery(query);
  }

  async updateOne (filter: Record<string, any>, query: Record<string, any>) {
    return SecurityRepository.updateOne(filter, query);
  }
}

export default new SecurityService();
