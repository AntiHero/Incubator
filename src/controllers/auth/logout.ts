import { Request, Response } from 'express';

import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';
import * as tokensBlackListRepository from '@/repository/tokensBlackList.repository';

export const logout = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty() || !req.cookies.refreshToken)
      return res.sendStatus(401);

    await tokensBlackListRepository.saveToken(req.cookies.refreshToken);

    res.sendStatus(204);
  },
];
