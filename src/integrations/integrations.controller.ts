import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';

import { UserId } from 'root/@core/decorators/user-id.decorator';
import { BearerAuthGuard } from 'root/@core/guards/bearer-auth.guard';
import { IntegrationService } from './service/integrations.service';

@Controller('integrations')
export class IntegrationsController {
  public constructor(private readonly integrationService: IntegrationService) {}

  @Post('telegram/webhook')
  public async telegramWebhook(@Body() body: any) {
    console.log(body);
  }

  @Get('telegram/auth-bot-link')
  @UseGuards(BearerAuthGuard)
  public async getTelegramLink(@UserId(ParseIntPipe) userId: number) {
    return this.integrationService.getActivationLink(userId);
  }
}
