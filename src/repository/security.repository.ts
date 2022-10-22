import { SecurityDevice } from '@/@types';
import { Repository } from './repository';
import { deviceAuthSessions } from '@/clients';

class SecurityRepository extends Repository<SecurityDevice> {
  async deleteAllButOneByDeviceIdQuery(query: { deviceId: string }) {
    await this.collection.deleteMany({ deviceId: { $nin: [query.deviceId] } });
  }
}

export default new SecurityRepository(deviceAuthSessions);
