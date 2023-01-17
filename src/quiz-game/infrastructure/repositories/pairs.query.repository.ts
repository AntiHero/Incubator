import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GamePairDTO } from 'root/quiz-game/types';
import { GameStatuses } from 'root/quiz-game/types/enum';
import { PairGame } from 'root/quiz-game/entity/pairs.entity';

@Injectable()
export class PairsQueryRepository {
  constructor(
    @InjectRepository(PairGame)
    private readonly pairsRepository: Repository<PairGame>,
    private readonly dataSource: DataSource,
  ) {}

  public async getCurrentGame(
    userId: string,
    activeOnly = false,
  ): Promise<GamePairDTO | null> {
    try {
      const currentGame = await this.dataSource
        .createQueryBuilder(PairGame, 'pairs')
        .useTransaction(true)
        .setLock('pessimistic_write', undefined, ['pairs'])
        .where([
          { firstPlayer: { id: Number(userId) }, status: GameStatuses.active },
          { secondPlayer: { id: Number(userId) }, status: GameStatuses.active },
          !activeOnly
            ? {
                firstPlayer: { id: Number(userId) },
                status: GameStatuses.pending,
              }
            : {},
        ])
        .setFindOptions({
          relations: {
            answers: {
              player: true,
              pairGame: true,
              question: true,
            },
          },
          order: {
            answers: {
              addedAt: 'ASC',
            },
          },
        })
        .getOne();

      // const answers = await manager
      //   .createQueryBuilder(Answer, 'answers')
      //   .leftJoinAndSelect('answers.player', 'player')
      //   .leftJoinAndSelect('answers.question', 'question')
      //   .leftJoinAndSelect('answers.pairGame', 'pairGame')
      //   .where('answers.playerId = :playerId', { playerId: Number(userId) })
      //   .andWhere('answers.pairGameId = :gameId', { gameId: currentGame?.id })
      //   .orderBy('"addedAt"', 'DESC')
      //   .getMany();

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
        relations: {
          answers: {
            pairGame: true,
            player: true,
            question: true,
          },
        },
        order: {
          answers: {
            addedAt: 'ASC',
          },
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
          status: GameStatuses.pending,
        },
      });

      return games[0]?.toDTO() ?? null;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
