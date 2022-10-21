import { h09 } from '@/@types';
import SecurityRepository from '@/repository/security.repository';

class SecurityService {
  async terminateAllSessions() {
    await SecurityRepository.deleteAll();
  }
  
  async getDevicesList() {
    return SecurityRepository.getAll();
  }
  
  async saveDevice(device: h09.DeviceViewModel) {
    return SecurityRepository.save(device);
  }
}

export default new SecurityService();
