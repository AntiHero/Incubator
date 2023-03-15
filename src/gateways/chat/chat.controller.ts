import { Controller, Get, Inject } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
export class ChatController {
  constructor(@Inject() private chatGateway: ChatGateway) {}

  @Get()
  joinChat() {
    const client = this.chatGateway.server.sockets.sockets[0];

    client.emit('message', 'Welcome to the chat!');
    return 'Connected to the chat.';
  }
}
