import { DeviceSecurity } from '@/@types';
import { Repository } from './repository';
import { deviceAuthSessions } from '@/clients';

class SecurityRepository extends Repository<DeviceSecurity> {}

export default new SecurityRepository(deviceAuthSessions);
