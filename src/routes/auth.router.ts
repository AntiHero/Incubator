import { Router } from 'express';

import { me } from '@/controllers/auth/me';
import { login } from '@/controllers/auth/login';
import { registration } from '@/controllers/auth/registration';
import { registrationConfirmation } from '@/controllers/auth/registration-confirmation';

const authRouer = Router();

authRouer.post('/login', login);

authRouer.post('/registration', registration);

authRouer.post('/registration-confirmation', registrationConfirmation);

authRouer.get('/me', me);

export default authRouer;
