import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PairGame } from 'root/quiz-game/entity/pairs.entity';
import { GameStatuses } from 'root/quiz-game/types/enum';
import {
  GamePairDTO,
  GamePayload,
  GameUpdates,
  QuestionDTO,
} from 'root/quiz-game/types';

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
      newGame.status = GameStatuses.pending;
      newGame.questions = [];
      newGame.answers = [];

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
        // READ COMMITTED DO THE JOB
        .update({
          status: GameStatuses.active,
          secondPlayer: {
            id: Number(userId),
          },
          startGameDate: new Date(),
        })
        .where({ status: GameStatuses.pending })
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
      await manager
        .createQueryBuilder(PairGame, 'pairs')
        .update()
        .set({
          ...gameUpdates,
        })
        .where({ id })
        .execute();
    } catch (e) {
      console.log(e);
    }
  }
}
