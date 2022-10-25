import { Router } from 'express';

import { me } from '@/controllers/auth/me';
import { login } from '@/controllers/auth/login';
import { logout } from '@/controllers/auth/logout';
import { registration } from '@/controllers/auth/registration';
import { refreshToken } from '@/controllers/auth/refresh-token';
import { passwordRecovery } from '@/controllers/auth/password-recovery';
import { registrationConfirmation } from '@/controllers/auth/registration-confirmation';
import { registrationEmailResending } from '@/controllers/auth/registration-email-resending';

const authRouer = Router();

authRouer.get('/me', me);

authRouer.post('/login', login);

authRouer.post('/logout', logout);

authRouer.post('/registration', registration);

authRouer.post('/refresh-token', refreshToken);

authRouer.post('/password-recovery', passwordRecovery);

authRouer.post('/registration-confirmation', registrationConfirmation);

authRouer.post('/registration-email-resending', registrationEmailResending);

export default authRouer;
