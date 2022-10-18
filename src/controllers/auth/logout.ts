import { Request, Response } from 'express';

import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { generateSecret } from '@/utils/generateSecret';

export const logout = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty() || !req.cookies.refreshToken)
      return res.sendStatus(401);

    const newSecret = generateSecret(10);
    process.env.SECRET = newSecret;

    res.sendStatus(204);
  },
];
