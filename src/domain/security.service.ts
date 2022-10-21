import { SecurityDevice } from '@/@types';
import SecurityRepository from '@/repository/security.repository';

class SecurityService {
  async terminateAllSessions() {
    await SecurityRepository.deleteAll();
  }

  async getDevicesList() {
    return SecurityRepository.getAll();
  }

  async saveDevice(device: SecurityDevice) {
    return SecurityRepository.save(device);
  }
}

export default new SecurityService();
