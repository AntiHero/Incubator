import {
  Get,
  Query,
  Header,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';

import { Statistics } from './types/enum';
import { TopUsersSanitizedQuery } from './types';
import Paginator from 'root/@common/models/Paginator';
import { TopQuerySanitizerPipe } from './@common/top-query.pipe';
import { UserId } from 'root/@common/decorators/user-id.decorator';
import { StatisticsConverter } from './utils/statistics.converter';
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

  @Get('top')
  @HttpCode(HttpStatus.OK)
  @Header('Content-type', 'text/plain')
  async getUsersTop(
    @Query(TopQuerySanitizerPipe) query: TopUsersSanitizedQuery,
  ) {
    const { pageNumber, pageSize } = query;

    const [topStats, totalCount] =
      await this.statisticsService.getTopStatistics(query);

    const items = topStats.map(StatisticsConverter.topStatsToView);

    const result = new Paginator(pageNumber, pageSize, totalCount, items);

    return result;
  }
}
