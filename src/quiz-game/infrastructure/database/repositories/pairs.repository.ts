import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PairGame } from 'root/quiz-game/infrastructure/database/entity/pairs.entity';
import { GameStatuses } from 'root/quiz-game/@common/types/enum';
import {
  GamePairDTO,
  GamePayload,
  GameUpdates,
  QuestionDTO,
} from 'root/quiz-game/@common/types';

@Injectable()
export class PairsRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PairGame)
    private readonly pairsRepository: Repository<PairGame>,
  ) {}

  public async createNewGame(
    gamePayload: GamePayload,
  ): Promise<GamePairDTO | null> {
    try {
      const newGame = new PairGame();

      const { firstPlayer } = gamePayload;

      newGame.firstPlayer = firstPlayer;
      newGame.status = GameStatuses.Pending;
      newGame.pairCreatedDate = new Date();

      await this.pairsRepository.save(newGame);

      return newGame.toDTO();
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async findPendingGameAndConnect(
    userId: string,
  ): Promise<GamePairDTO | null> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const updateResult = await manager
        .getRepository(PairGame)
        .createQueryBuilder('game')
        .useTransaction(true)
        .setLock('pessimistic_write')
        // READ COMMITTED DO THE JOB
        .update({
          status: GameStatuses.Active,
          secondPlayer: {
            id: Number(userId),
          },
          startGameDate: new Date(),
        })
        .where({ status: GameStatuses.Pending })
        .returning('id')
        .execute();

      const { id } = updateResult.raw[0] ?? {};

      let game: PairGame | null;

      if (id) {
        game = await manager.findOne(PairGame, { where: { id } });
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return game?.toDTO() ?? null;
    } catch (e) {
      console.log('error');
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      return null;
    }
  }

  public async deleteAllGames() {
    try {
      await this.pairsRepository.delete({});
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async addQuestions(gameId: string, questions: QuestionDTO[]) {
    try {
      await this.pairsRepository
        .createQueryBuilder()
        .update()
        .set({
          questions: <any>questions,
        })
        .where('id = :gameId', { gameId })
        .execute();
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async updateGame(gameUpdates: GameUpdates, manager: EntityManager) {
    const { id } = gameUpdates;
    try {
      const updates = await manager
        .createQueryBuilder(PairGame, 'pairs')
        .update()
        .set({
          ...gameUpdates,
        })
        .where({ id })
        .returning([
          'firstPlayerScore',
          'secondPlayerScore',
          'firstPlayerAnswers',
          'secondPlayerAnswers',
        ])
        .execute();

      return updates.raw[0];
    } catch (e) {
      console.log(e);
    }
  }
}
