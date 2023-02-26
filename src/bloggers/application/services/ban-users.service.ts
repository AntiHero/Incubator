import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'root/users/entity/user.entity';
import { PaginationQueryType } from 'root/@core/types';
import { countSkip } from 'root/@core/utils/count-skip';
import { BannedUserForEntityDTO } from 'root/bloggers/@common/types';
import { ConvertBannedUserData } from 'root/bloggers/@common/utils/convertBannedUser';
import { BannedUser } from 'root/bloggers/infrastructure/database/entities/banned-user.entity';
import { getBannedUsersByQuery } from 'root/bloggers/infrastructure/database/queries/get-banned-users.query';

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
              SELECT id FROM banned_users WHERE "userId"=$1 AND "entityId"=$2
            `,
            [userId, blogId],
          )
        )[0]?.id;

        if (!userInBannedListId) {
          await this.bannedUsersRepository.query(
            `
              INSERT INTO banned_users ("userId", "entityId", "banReason", "isBanned", "banDate") 
                VALUES ($1, $2, $3, $4, $5) 
            `,
            [userId, blogId, banReason, isBanned, new Date().toISOString()],
          );
        } else {
          await this.bannedUsersRepository.query(
            `
              UPDATE banned_users 
                SET "userId"=$1, "entityId"=$2, "banReason"=$3, "isBanned"=$4, "banDate"=$5
                WHERE id=$6
            `,
            [
              userId,
              blogId,
              banReason,
              isBanned,
              new Date().toISOString(),
              userInBannedListId,
            ],
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

    const count = (
      await this.bannedUsersRepository.query(
        `
            SELECT COUNT(*) FROM users WHERE (login ~* '${searchLoginTerm}' AND
              users.id IN (SELECT "userId" FROM banned_users WHERE "entityId"=$1))
          `,
        [blogId],
      )
    )[0]?.count;

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

    return [bannedUsers.map(ConvertBannedUserData.toDTO), Number(count)];
  }

  async deleteAllBannedUsers() {
    await this.bannedUsersRepository.query(`DELETE FROM banned_users`);
  }
}
