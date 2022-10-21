import { Router } from 'express';

import { deleteDevice } from '@/controllers/security/deleteDevice';
import { getAllDevices } from '@/controllers/security/getAllDevices';
import { deleteAllDevices } from '@/controllers/security/deleteAllDevices';

const securityDeviceRouter = Router();

securityDeviceRouter.get('/', getAllDevices);

securityDeviceRouter.delete('/', deleteAllDevices);

securityDeviceRouter.delete('/:id', deleteDevice);

export default securityDeviceRouter;
