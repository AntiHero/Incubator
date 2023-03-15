import { WebSocketServer } from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets/interfaces';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsException,
} from '@nestjs/websockets';

@WebSocketGateway(8000, {
  // path: '/chat',
  // transports: ['polling', 'websocket'],
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  clients: Map<Socket, string> = new Map();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ..._: any[]) {
    const token = client.handshake.auth.token;
    console.log(token);
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): WsResponse<string> {
    console.log(`Client: ${data}`);

    // client can receive messages when we are using this format
    return { event: 'message', data };
  }

  forceDisconnect(client: Socket, message: string) {
    client.emit(
      'unauthorized',
      new WsException({ type: 'error', text: message }),
    );
    client.disconnect(true);
  }
}
