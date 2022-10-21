import { SecuirityDeviceInput } from '@/@types';
import SecurityRepository from '@/repository/security.repository';

class SecurityService {
  async terminateAllSessions() {
    await SecurityRepository.deleteAll();
  }

  async getDevicesList() {
    return SecurityRepository.getAll();
  }

  async saveDevice(device: SecuirityDeviceInput) {
    return SecurityRepository.save(device);
  }

  async getDevice(query: Record<string, any>) {
    return SecurityRepository.findByQuery(query);
  }
}

export default new SecurityService();
