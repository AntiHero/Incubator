import { Router } from 'express';

import { me } from '@/controllers/auth/me';
import { login } from '@/controllers/auth/login';
import { registration } from '@/controllers/auth/registration';
import { registrationConfirmation } from '@/controllers/auth/registration-confirmation';
import { registrationEmailResending } from '@/controllers/auth/registration-email-resending';

const authRouer = Router();

authRouer.get('/me', me);

authRouer.post('/login', login);

authRouer.post('/registration', registration);

authRouer.post('/registration-confirmation', registrationConfirmation);

authRouer.post('/registration-email-resending', registrationEmailResending);

export default authRouer;
