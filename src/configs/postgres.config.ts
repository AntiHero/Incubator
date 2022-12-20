import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from 'root/users/entity/user.entity';
import { Post } from 'root/posts/entity/post.entity';
import { Blog } from 'root/blogs/entity/blog.entity';
import { Token } from 'root/tokens/entity/token.entity';
import { Comment } from 'root/comments/entity/comment.entity';
import { BannedUser } from 'root/bloggers/entity/banned-user.entity';
import { UserBanInfo } from 'root/users/entity/user-ban-info.entity';
import { CommentLike, PostLike } from 'root/likes/entity/like.entity';
import { PasswordRecovery } from 'root/users/entity/password-recovery.entity';
import { SecurityDevice } from 'root/security-devices/entity/security-device.entity';
import { UserConfirmationInfo } from 'root/users/entity/user-confirmation-info.entity';

export const getPostgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    synchronize: true,
    entities: [
      User,
      Blog,
      Post,
      Token,
      Comment,
      PostLike,
      BannedUser,
      UserBanInfo,
      CommentLike,
      SecurityDevice,
      PasswordRecovery,
      UserConfirmationInfo,
    ],
  };
};
