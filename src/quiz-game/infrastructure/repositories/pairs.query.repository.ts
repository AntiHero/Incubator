import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { countSkip } from 'root/@common/utils/count-skip';
import { GameStatuses } from 'root/quiz-game/types/enum';
import { PairGame } from 'root/quiz-game/entity/pairs.entity';
import { GamePairDTO, PairsQuery } from 'root/quiz-game/types';

@Injectable()
export class PairsQueryRepository {
  constructor(
    @InjectRepository(PairGame)
    private readonly pairsRepository: Repository<PairGame>,
  ) {}

  public async getCurrentGame(
    userId: string,
    activeOnly = false,
  ): Promise<GamePairDTO | null> {
    try {
      const currentGame = await this.pairsRepository.findOne({
        where: [
          { firstPlayer: { id: Number(userId) }, status: GameStatuses.Active },
          { secondPlayer: { id: Number(userId) }, status: GameStatuses.Active },
          !activeOnly
            ? {
                firstPlayer: { id: Number(userId) },
                status: GameStatuses.Pending,
              }
            : {},
        ],
      });

      if (!currentGame) return null;

      return currentGame.toDTO();
    } catch (e) {
      console.log(e);

      return null;
    }
  }

  public async getGameById(
    gameId: string,
    gameStatus?: { status?: GameStatuses },
  ): Promise<GamePairDTO | null> {
    try {
      const game = await this.pairsRepository.findOne({
        where: {
          id: gameId,
          ...gameStatus,
        },
      });

      return game?.toDTO() ?? null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async findPendingGame(): Promise<GamePairDTO | null> {
    try {
      const games = await this.pairsRepository.find({
        where: {
          status: GameStatuses.Pending,
        },
      });

      return games[0]?.toDTO() ?? null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async getMyGames(
    userId: number,
    query: PairsQuery,
  ): Promise<[GamePairDTO[], number]> {
    const { pageSize, pageNumber, sortBy, sortDirection } = query;

    try {
      const games = await this.pairsRepository
        .createQueryBuilder('pairs')
        .setFindOptions({
          relations: {
            firstPlayer: true,
            secondPlayer: true,
          },
          order: {
            [sortBy]: sortDirection,
            pairCreatedDate: 'DESC',
          },
        })
        .where([
          { firstPlayer: { id: userId }, status: GameStatuses.Active },
          { secondPlayer: { id: userId }, status: GameStatuses.Active },
          { firstPlayer: { id: userId }, status: GameStatuses.Finished },
          { secondPlayer: { id: userId }, status: GameStatuses.Finished },
        ])
        .skip(countSkip(pageSize, pageNumber))
        .take(pageSize)
        .getManyAndCount();

      return [games[0].map((game) => game.toDTO()), games[1]];
    } catch (err) {
      console.log(err);

      return null;
    }
  }
}
