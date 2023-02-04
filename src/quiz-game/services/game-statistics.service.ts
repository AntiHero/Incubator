import { Injectable } from '@nestjs/common';

import { PairsQueryRepository } from '../infrastructure/repositories/pairs.query.repository';
import { Statistics } from '../types/enum';

@Injectable()
export class PairsStatisticsService {
  constructor(private readonly pairsQueryRepository: PairsQueryRepository) {}

  public async getSummaryScore(id: number): Promise<number> {
    return this.pairsQueryRepository.getPlayerSumScore(id);
  }

  public async getAverageScore(id: number): Promise<number> {
    return this.pairsQueryRepository.getPlayerAvgScore(id);
  }

  public async getGamesCount(id: number): Promise<number> {
    return this.pairsQueryRepository.getPlayerGameCount(id);
  }

  public async getWinsCount(id: number): Promise<number> {
    return this.pairsQueryRepository.getPlayerWinsCount(id);
  }

  public async getLossesCount(id: number): Promise<number> {
    return this.pairsQueryRepository.getPlayerLossesCount(id);
  }

  public async getDrawsCount(id: number): Promise<number> {
    return this.pairsQueryRepository.getPlayerDrawsCount(id);
  }

  public async getStatistics(id: number, statistics: Statistics) {
    const result: Partial<Record<Statistics, number>> = {};

    if (statistics === Statistics.all) {
      result.sumScore = await this.getSummaryScore(id);
      result.avgScore = await this.getAverageScore(id);
      result.gamesCount = await this.getGamesCount(id);
      result.winsCount = await this.getWinsCount(id);
      result.lossesCount = await this.getLossesCount(id);
      result.drawsCount = await this.getDrawsCount(id);
    }

    return result;
  }
}
