import { Router } from 'express';

import { me } from '@/controllers/auth/me';
import { login } from '@/controllers/auth/login';

const authRouer = Router();

authRouer.post('/login', login);

authRouer.get('/me', me);

export default authRouer;
