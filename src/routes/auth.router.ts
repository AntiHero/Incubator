import { Router } from 'express';

import { login } from '@/controllers/auth/login';

const authRouer = Router();

authRouer.post('/login', login);

export default authRouer;
