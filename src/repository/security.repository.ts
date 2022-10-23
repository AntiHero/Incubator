import { SecurityDevice } from '@/@types';
import { Repository } from './repository';
import { deviceAuthSessions } from '@/clients';

class SecurityRepository extends Repository<SecurityDevice> {
  async deleteAllButOne(query: { userId: string; deviceId: string }) {
    await this.collection.deleteMany({
      userId: query.userId,
      deviceId: { $nin: [query.deviceId] },
    });
  }
}

export default new SecurityRepository(deviceAuthSessions);
