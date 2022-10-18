import { Request, Response } from 'express';

import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';
import * as tokensBlackListRepository from '@/repository/tokensBlackList.repository';
import { TokenInputModel } from '@/@types';

export const logout = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty() || !req.cookies.refreshToken)
      return res.sendStatus(401);

    await tokensBlackListRepository.saveToken({ value: req.cookies.refreshToken} as TokenInputModel);

    res.sendStatus(204);
  },
];
