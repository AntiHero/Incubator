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

    const dbUser = await UsersService.getUser(req.userId);

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

[
  {
    deviceId: '86df9dac-fe57-4639-961e-f507a92fdec4',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T21:47:36.539Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
  {
    deviceId: 'bbb7bc7e-4bd2-4434-8d83-a61b0f3e1bd1',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T21:47:37.113Z',
    title:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/103.0',
  },
  {
    deviceId: '3ea78ad1-d239-4b3f-abd5-c2645ff2dccf',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T21:47:37.699Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  },
  {
    deviceId: '329af648-213e-45ea-aa6d-ed6eb1ab9573',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T21:47:38.266Z',
    title:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
  },
  {
    deviceId: '0216a868-db52-4f84-9eab-5fabf8fdecfe',
    ip: '3.73.132.52',
    lastActiveDate: '2022-10-22T21:47:42.455Z',
    title:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  },
];
