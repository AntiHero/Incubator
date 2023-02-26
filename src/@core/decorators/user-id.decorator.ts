import jwt from 'jsonwebtoken';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

export const UserId = createParamDecorator((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;

  const authHeader = request.get('authorization');

  let userId = '';

  if (authHeader) {
    const [, token] = authHeader.split(/\s+/);

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET ?? 'simple_secret',
      ) as jwt.JwtPayload;

      userId = decodedToken.id;
    } catch (e) {
      console.log('error');
    }
  }

  return userId;
});
