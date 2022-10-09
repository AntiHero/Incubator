import { Router } from 'express';

import { getUsers } from '@/controllers/user/getUsers';
import { createUser } from '@/controllers/user/createUser';
import { deleteUser } from '@/controllers/user/deleteUser';

const usersRouter = Router();

usersRouter.route('/').get(getUsers).post(createUser);

usersRouter.route('/:id').delete(deleteUser);

export default usersRouter;
