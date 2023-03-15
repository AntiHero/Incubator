import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export class WsAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = <string>client.handshake.headers.token;

    try {
      jwt.verify(
        token,
        process.env.SECRET ?? 'simple_secret',
      ) as jwt.JwtPayload;
    } catch (e) {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
