import { Request, Response } from 'express';

import { convertToUser } from '@/utils/convertToUser';
import * as UsersService from '@/domain/users.service';
import { h06, TokenInputModel, UserForToken } from '@/@types';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';
import { customValidationResult } from '@/customValidators/customValidationResults';
import * as tokensBlackListRepository from '@/repository/tokensBlackList.repository';

export const refreshToken = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    const dbUser = await UsersService.getUser(req.userId)
    
    if (!dbUser) return res.sendStatus(404); 
    
    const user = convertToUser(dbUser);

    const userForToken: UserForToken = {
      login: user.login,
      userId: req.userId,
      deviceId: req.deviceId,
    };

    const [token, refreshToken] = await UsersService.createTokensPair(
      userForToken
    );

    const payload: h06.LoginSuccessViewModel = { accessToken: token };

    await tokensBlackListRepository.saveToken({
      value: req.cookies.refreshToken,
      expDate: String(req.refreshTokenExp),
    } as TokenInputModel);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json(payload);
  },
];
