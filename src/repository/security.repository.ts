import { SecurityDevice } from '@/@types';
import { Repository } from './repository';
import { deviceAuthSessions } from '@/clients';

class SecurityRepository extends Repository<SecurityDevice> {}

export default new SecurityRepository(deviceAuthSessions);
