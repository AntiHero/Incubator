import SecurityRepository from '@/repository/security.repository';

class SecurityService {
  async terminateAllSessions() {
    await SecurityRepository.deleteAll();
  }
  
  async getDevicesList() {
    return SecurityRepository.getAll();
  }
}

export default new SecurityService();
