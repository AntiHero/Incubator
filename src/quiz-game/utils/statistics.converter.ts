import { TopGamePlayerViewModel, TopUsersDBType } from '../types';

export class StatisticsConverter {
  public static topStatsToView(
    statistics: TopUsersDBType,
  ): TopGamePlayerViewModel {
    const {
      login,
      sumScore,
      playerId,
      avgScores,
      winsCount,
      gamesCount,
      drawsCount,
      lossesCount,
    } = statistics;

    return {
      sumScore: Number(sumScore),
      winsCount: Number(winsCount),
      avgScores: Number(avgScores),
      gamesCount: Number(gamesCount),
      drawsCount: Number(drawsCount),
      lossesCount: Number(lossesCount),
      player: {
        login,
        id: playerId,
      },
    };
  }
}
