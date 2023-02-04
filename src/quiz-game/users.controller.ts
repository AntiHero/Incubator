import {
  Get,
  Header,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';

import { Statistics } from './types/enum';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { BearerAuthGuard } from 'root/@common/guards/bearer-auth.guard';
import { PairsStatisticsService } from './services/game-statistics.service';

@Controller('pair-game-quiz/users')
export class PairsUserController {
  constructor(private readonly statisticsService: PairsStatisticsService) {}

  @Get('my-statistic')
  @HttpCode(HttpStatus.OK)
  @UseGuards(BearerAuthGuard)
  @Header('Content-type', 'text/plain')
  async getStatistics(@UserId(ParseIntPipe) userId: number) {
    const statistics = this.statisticsService.getStatistics(
      userId,
      Statistics.all,
    );

    return statistics;
  }
}
