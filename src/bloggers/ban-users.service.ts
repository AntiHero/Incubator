import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BannedUserForEntityDTO } from './types';
import { User } from 'root/users/entity/user.entity';
import { BannedUser } from './entity/banned-user.entity';
import { PaginationQueryType } from 'root/@common/types';
import { countSkip } from 'root/@common/utils/count-skip';
import { ConvertBannedUserData } from './utils/convertBannedUser';
import { getBannedUsersByQuery } from './query/get-banned-users.query';

@Injectable()
export class BanUsersByBloggerService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(BannedUser)
    private readonly bannedUsersRepository: Repository<BannedUser>,
  ) {}

  async banUser(
    userId: string,
    blogId: string,
    isBanned: boolean,
    banReason: string | null,
  ) {
    try {
      if (isBanned) {
        const userInBannedListId = (
          await this.bannedUsersRepository.query(
            `
              SELECT id FROM banned_users WHERE "userId"=$1 AND "entityId"=$2 REU
            `,
            [userId, blogId],
          )
        )[0]?.id;

        if (!userInBannedListId) {
          await this.bannedUsersRepository.query(
            `
              INSERT INTO banned_users ("userId", "entityId", "banReason", "isBanned", "banDate") 
                VALUES $1, $2, $3, $4, DEFAULT 
            `,
            [userId, blogId, isBanned, banReason],
          );
        } else {
          await this.bannedUsersRepository.query(
            `
              UPDATE banned_users 
                SET "userId"=$1, "entityId"=$2, "banReason"=$3, "isBanned"=$4, "banDate"=NOW()
                WHERE id=$5
            `,
            [userId, blogId, isBanned, banReason, userInBannedListId],
          );
        }
      } else {
        await this.bannedUsersRepository.query(
          `
            DELETE FROM banned_users WHERE "userId"=$1 AND "entityId"=$2
          `,
          [userId, blogId],
        );
      }
    } catch (error) {
      console.error(error);

      return null;
    }

    return true;
  }

  async findBannedUser(userId: string, blogId: string) {
    const bannedUser = (
      await this.bannedUsersRepository.query(
        `
        SELECT * FROM banned_users WHERE "userId"=$1 AND "entityId"=$2
      `,
        [userId, blogId],
      )
    )[0];

    if (!bannedUser) return null;

    return bannedUser;
  }

  async findBannedUsersByQuery(
    blogId: string,
    query: PaginationQueryType,
  ): Promise<[BannedUserForEntityDTO[], any]> {
    const { searchLoginTerm, sortBy, sortDirection, pageSize: limit } = query;
    const offset = countSkip(query.pageSize, query.pageNumber);

    const count =
      (
        await this.bannedUsersRepository.query(
          `
            SELECT COUNT(*) FROM users WHERE (login ~* '${searchLoginTerm}') AND
              users.id=(SELECT "userId" FROM banned_users WHERE "entityId"=$1)
          `,
          [blogId],
        )
      )[0]?.count ?? 0;

    const bannedUsers = await this.usersRepository.query(
      getBannedUsersByQuery(
        searchLoginTerm,
        sortBy,
        sortDirection,
        limit,
        offset,
      ),
      [blogId],
    );

    return [bannedUsers.map(ConvertBannedUserData.toDTO), count];
  }

  async deleteAllBannedUsers() {
    await this.bannedUsersRepository.query(`DELETE FROM banned_users`);
  }
}
