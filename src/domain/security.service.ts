import SecurityRepository from '@/repository/security.repository';

class SecurityService {
  async terminateAllSessions() {
    await SecurityRepository.deleteAll();
  }
}

export default SecurityService;
