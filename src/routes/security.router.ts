import { Router } from 'express';

import { getAllDevices } from '@/controllers/security/getAllDevices';
import { deleteAllDevices } from '@/controllers/security/deleteAllDevices';

const securityDeviceRouter = Router();

securityDeviceRouter.get('/', getAllDevices);

securityDeviceRouter.delete('/', deleteAllDevices);

securityDeviceRouter.delete('/:id', () => {
  null;
});

export default securityDeviceRouter;
