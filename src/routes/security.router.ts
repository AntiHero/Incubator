import { Router } from 'express';

import { deleteAllDevices } from '@/controllers/security/deleteAll';

const securityDeviceRouter = Router();

securityDeviceRouter.delete('/', deleteAllDevices);

securityDeviceRouter.delete('/:id', () => {
  null;
});

export default securityDeviceRouter;
