import { Injectable } from '@nestjs/common';

import { BanInfo } from 'root/users/types';
import { UsersService } from 'root/users/users.service';
import { LikesService } from 'root/likes/likes.service';
import { OptionalKey } from 'root/@common/types/utility';
import { CommentsService } from 'root/comments/comments.service';

@Injectable()
export class AdminsService {
  constructor(
    private usersRepository: UsersService,
    private commentsService: CommentsService,
    private likesService: LikesService,
  ) {}

  async banUser(id: string, data: Omit<BanInfo, 'banDate'>) {
    let banInfo: OptionalKey<BanInfo, 'banDate'>;

    if (data.isBanned) {
      banInfo = { ...data, banDate: new Date().toISOString() };
    } else {
      banInfo = { ...data };
    }

    return this.usersRepository.banUser(id, banInfo);
  }
}
