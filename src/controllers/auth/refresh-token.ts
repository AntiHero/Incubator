import { h06, User } from '@/@types';
import { Request, Response } from 'express';
import { convertToUser } from '@/utils/convertToUser';
import * as UsersService from '@/domain/users.service';
import { customValidationResult } from '@/customValidators/customValidationResults';
import { validateRefreshToken } from '@/customValidators/refreshTokenValidator';

export const refreshToken = [
  validateRefreshToken,
  async (req: Request, res: Response) => {
    if (!customValidationResult(req).isEmpty()) return res.sendStatus(401);

    const user = convertToUser(
      (await UsersService.getUser(req.userId)) as User
    );

    const userForToken = {
      username: user.login,
      id: user.id,
    };

    const [token, refreshToken] = UsersService.generateTokens(userForToken);
    const payload: h06.LoginSuccessViewModel = { accessToken: token };

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json(payload);
  },
];
