import { Raw, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { countSkip } from 'root/@core/utils/count-skip';
import { GameStatuses, Statistics } from 'root/quiz-game/@common/types/enum';
import { PairGame } from 'root/quiz-game/infrastructure/database/entity/pairs.entity';
import {
  GamePairDTO,
  PairsQuery,
  TopUsersDBType,
  TopUsersSanitizedQuery,
} from 'root/quiz-game/@common/types';

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

  public async getPlayerSumScore(id: number): Promise<number> {
    try {
      const result = await this.pairsRepository
        .createQueryBuilder('pairs')
        .select(
          `SUM(CASE 
          WHEN pairs."firstPlayerId" = ${id} THEN pairs."firstPlayerScore"
          WHEN pairs."secondPlayerId" = ${id} THEN pairs."secondPlayerScore"
          ELSE 0
          END)`,
          'sumScore',
        )
        .where([
          { firstPlayer: { id }, status: GameStatuses.Finished },
          { secondPlayer: { id }, status: GameStatuses.Finished },
        ])
        .execute();

      return Number(result[0].sumScore);
    } catch (err) {
      console.log(err);

      return 0;
    }
  }

  public async getPlayerAvgScore(id: number): Promise<number> {
    try {
      const result = await this.pairsRepository
        .createQueryBuilder('pairs')
        .select(
          `ROUND(AVG(CASE 
          WHEN pairs."firstPlayerId" = ${id} THEN pairs."firstPlayerScore"
          WHEN pairs."secondPlayerId" = ${id} THEN pairs."secondPlayerScore"
          ELSE 0
          END), 2)`,
          'avgScore',
        )
        .where([
          { firstPlayer: { id }, status: GameStatuses.Finished },
          { secondPlayer: { id }, status: GameStatuses.Finished },
        ])
        .execute();

      return Number(result[0].avgScore) || 0;
    } catch (err) {
      console.log(err);

      return 0;
    }
  }

  public async getPlayerGameCount(id: number): Promise<number> {
    try {
      const result = await this.pairsRepository
        .createQueryBuilder('pairs')
        .where([
          { firstPlayer: { id }, status: GameStatuses.Finished },
          { secondPlayer: { id }, status: GameStatuses.Finished },
        ])
        .getCount();

      return result;
    } catch (err) {
      console.log(err);

      return 0;
    }
  }

  public async getPlayerWinsCount(id: number): Promise<number> {
    try {
      const result = await this.pairsRepository
        .createQueryBuilder('pairs')
        .where([
          {
            firstPlayer: { id },
            status: GameStatuses.Finished,
            firstPlayerScore: Raw(
              (alias) => `${alias} > pairs."secondPlayerScore"`,
            ),
          },
          {
            secondPlayer: { id },
            status: GameStatuses.Finished,
            secondPlayerScore: Raw(
              (alias) => `${alias} > pairs.firstPlayerScore`,
            ),
          },
        ])
        .getCount();

      return result;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  public async getPlayerLossesCount(id: number): Promise<number> {
    try {
      const result = await this.pairsRepository
        .createQueryBuilder('pairs')
        .where([
          {
            firstPlayer: { id },
            status: GameStatuses.Finished,
            firstPlayerScore: Raw(
              (alias) => `${alias} < pairs."secondPlayerScore"`,
            ),
          },
          {
            secondPlayer: { id },
            status: GameStatuses.Finished,
            secondPlayerScore: Raw(
              (alias) => `${alias} < pairs.firstPlayerScore`,
            ),
          },
        ])
        .getCount();

      return result;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  public async getPlayerDrawsCount(id: number): Promise<number> {
    try {
      const result = await this.pairsRepository
        .createQueryBuilder('pairs')
        .where([
          {
            firstPlayer: { id },
            status: GameStatuses.Finished,
            firstPlayerScore: Raw(
              (alias) => `${alias} = pairs."secondPlayerScore"`,
            ),
          },
          {
            secondPlayer: { id },
            status: GameStatuses.Finished,
            secondPlayerScore: Raw(
              (alias) => `${alias} = pairs.firstPlayerScore`,
            ),
          },
        ])
        .getCount();

      return result;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  public async getTopStatistics(
    query: TopUsersSanitizedQuery,
  ): Promise<[TopUsersDBType[], number]> {
    const { pageNumber, pageSize, sort } = query;
    const offset = countSkip(pageSize, pageNumber);
    const order = sort
      .map((value) => {
        return `"${value[0]}" ${value[1]}`;
      })
      .join(', ');

    try {
      const totalCount =
        Number(
          (
            await this.pairsRepository.query(
              `
              SELECT COUNT(*) FROM (
                SELECT "firstPlayerId" AS "playerId"
                FROM pairs p
                WHERE p.status = 'Finished'
                GROUP BY "firstPlayerId"
                UNION
                SELECT "secondPlayerId"
                FROM pairs p
                WHERE p.status = 'Finished'
                GROUP BY "secondPlayerId"
              ) AS ids
            `,
            )
          )[0]?.count,
        ) || 0;

      const result: TopUsersDBType[] = await this.pairsRepository.query(
        `
          WITH ids AS (
            SELECT "firstPlayerId" AS "playerId"
            FROM pairs p
            WHERE p.status = 'Finished'
            GROUP BY "firstPlayerId"
            UNION
            SELECT "secondPlayerId"
            FROM pairs p
            WHERE p.status = 'Finished'
            GROUP BY "secondPlayerId"
          ) 
          SELECT 
            "playerId", 
            u.login,
            SUM(
              CASE 
                WHEN ("playerId" = p."firstPlayerId" AND p."firstPlayerScore" > p."secondPlayerScore")
                  OR  ("playerId" = p."secondPlayerId" AND p."secondPlayerScore" > p."firstPlayerScore")
                THEN 1 ELSE 0 END  
              ) AS "${Statistics.winsCount}",
            SUM(
              CASE 
                WHEN ("playerId" = p."firstPlayerId" AND p."firstPlayerScore" < p."secondPlayerScore")
                  OR  ("playerId" = p."secondPlayerId" AND p."secondPlayerScore" < p."firstPlayerScore")
                THEN 1 ELSE 0 END  
              ) AS "${Statistics.lossesCount}",
            SUM(
              CASE 
                WHEN ("playerId" = p."firstPlayerId" OR "playerId" = p."secondPlayerId") 
                  AND p."firstPlayerScore" = p."secondPlayerScore"
                THEN 1 ELSE 0 END  
              ) AS "${Statistics.drawsCount}",
            SUM(
              CASE 
                WHEN ("playerId" = p."firstPlayerId" OR  "playerId" = p."secondPlayerId")
                THEN 1 ELSE 0 END  
              ) AS "${Statistics.gamesCount}",
            SUM(
              CASE 
                WHEN p."firstPlayerId" = "playerId" 
                THEN p."firstPlayerScore"
                WHEN p."secondPlayerId" = "playerId" 
                THEN p."secondPlayerScore"
              ELSE 0 END
              ) AS "${Statistics.sumScore}",
            ROUND(
              AVG(
                CASE 
                  WHEN p."firstPlayerId" = "playerId" 
                  THEN p."firstPlayerScore"
                  WHEN p."secondPlayerId" = "playerId"
                  THEN p."secondPlayerScore"
                ELSE 0
                END), 2) AS "${Statistics.avgScore}"
          FROM ids 
          LEFT JOIN pairs p 
          ON "playerId" = p."firstPlayerId" OR "playerId" = p."secondPlayerId"
          LEFT JOIN users u
          ON "playerId" = u.id
          WHERE p.status = 'Finished'
          GROUP BY "playerId", u.login
          ORDER BY ${order}
          LIMIT $1
          OFFSET $2
        `,
        [pageSize, offset],
      );

      return [result, totalCount];
    } catch (err) {
      console.log(err);

      return [[], 0];
    }
  }
}
