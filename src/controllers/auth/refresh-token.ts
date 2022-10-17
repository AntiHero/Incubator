import jwt from 'jsonwebtoken';
import { h06, User } from '@/@types';
import { cookie } from 'express-validator';
import { Request, Response } from 'express';
import { convertToUser } from '@/utils/convertToUser';
import * as UsersService from '@/domain/users.service';
import { customValidationResult } from '@/customValidators/customValidationResults';

export const refreshToken = [
  cookie('refreshToken').custom((token, { req }) => {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET ?? 'simple_secret'
      ) as jwt.JwtPayload;
      const id = decodedToken.id;

      if (!id) {
        throw new Error('Invalid token');
      } else {
        req.userId = id;
      }
    } catch (e) {
      throw new Error('Invalid token');
    }

    return true;
  }),
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
