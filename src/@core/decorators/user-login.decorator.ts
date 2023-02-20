import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserLogin = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;

    const authHeader = request.get('authorization');

    let userLogin = '';

    if (authHeader) {
      const [, token] = authHeader.split(/\s+/);

      try {
        const decodedToken = jwt.verify(
          token,
          process.env.SECRET ?? 'simple_secret',
        ) as jwt.JwtPayload;

        userLogin = decodedToken.username;
      } catch (e) {}
    }

    return userLogin;
  },
);
