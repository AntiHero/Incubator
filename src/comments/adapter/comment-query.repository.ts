import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Comment } from '../entity/comment.entity';
import { User } from 'root/users/entity/user.entity';
import { LikeStatuses } from 'root/@common/types/enum';
import { PaginationQueryType } from 'root/@common/types';
import { CommentLike } from 'root/likes/entity/like.entity';
import { ConvertCommentData } from '../utils/convertComment';
import { CommentDTO, CommentExtendedLikesDTO } from '../types';
import { ConvertLikeData } from 'root/likes/utils/convertLike';
import { getLikesCount } from '../query/get-comment-likes-count.query';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
  ) {}

  async getAllComments() {
    const comments = await this.commentsRepository.query(
      `
        SELECT * FROM comments 
      `,
    );

    return comments.map(ConvertLikeData.toDTO);
  }

  async findCommentById(id: string): Promise<CommentDTO> {
    const comment: Comment = (
      await this.commentsRepository.query(
        `
          SELECT * FROM comments WHERE id=$1
        `,
        [id],
      )
    )[0];

    const userLogin =
      (
        await this.usersRepository.query(
          `
            SELECT "login" FROM users WHERE id=$1
          `,
          [comment.userId],
        )
      )[0]?.login ?? '';

    return { ...ConvertCommentData.toDTO(comment), userLogin, likes: [] };
  }

  async countComments(entityId: string) {
    try {
      const count = (
        await this.commentsRepository.query(
          `
              SELECT COUNT(*) FROM comments WHERE "entityId"=$1 
            `,
          [entityId],
        )
      )[0]?.count;

      return Number(count);
    } catch (error) {
      console.error(error);

      return 0;
    }
  }

  async getExtendedCommentInfo(id: string, userId = '') {
    const comment = (
      await this.commentsRepository.query(
        `
          SELECT * FROM comments WHERE id=$1 
        `,
        [id],
      )
    )[0];

    if (!comment || comment.isBanned) return null;

    const likesAndDislikesCount = (
      await this.commentLikesRepository.query(getLikesCount, [comment.id])
    )[0];

    const likesCount = likesAndDislikesCount?.likesCount ?? 0;
    const dislikesCount = likesAndDislikesCount?.dislikesCount ?? 0;

    const userLogin =
      (
        await this.usersRepository.query(
          `
            SELECT "login" AS "userLogin" FROM users WHERE id=$1
          `,
          [comment.userId],
        )
      )[0]?.userLogin ?? '';

    let userStatus: LikeStatuses = LikeStatuses.None;
    if (userId) {
      userStatus =
        (
          await this.commentLikesRepository.query(
            `
              SELECT "likeStatus" FROM comment_likes WHERE "userId"=$1 AND "entityId"=$2
            `,
            [userId, comment.id],
          )
        )[0]?.likeStatus ?? LikeStatuses.None;
    }

    const extendedComment: CommentExtendedLikesDTO = {
      ...ConvertCommentData.toDTO(comment),
      userLogin,
      likesCount: Number(likesCount),
      dislikesCount: Number(dislikesCount),
      userStatus,
    };

    return extendedComment;
  }

  async findCommentsByQuery(query: PaginationQueryType, entityId?: string) {
    // const { sortBy, sortDirection, pageSize: limit } = query;
    // const offset = countSkip(query.pageSize, query.pageNumber);

    // let comments = [];
    // if (entityId) {
    //   const filter = `\"entityId\"=${entityId}`;

    //   comments = await this.commentsRepository.query(
    //     getCommentsWithFilterByQuery(
    //       filter,
    //       sortBy,
    //       sortDirection,
    //       limit,
    //       offset,
    //     ),
    //     [entityId],
    //   );
    // }
    return null;
  }
}

//   async findCommentByIdAndDelete(id: string) {
//     const result = await this.model
//       .findOneAndRemove({ _id: new Types.ObjectId(id) })
//       .lean();

//     if (result) return true;

//     return null;
//   }

//   async findCommentByIdAndUpdate(
//     id: string,
//     updates: Partial<CommentDomainModel>,
//   ) {
//     try {
//       const result = await this.model.findByIdAndUpdate(id, updates).lean();

//       if (result) return true;
//     } catch (e) {
//       console.error(e);
//     }

//     return null;
//   }

//   async updateComments(userId: string, update: Partial<UserDTO>) {
//     return this.model.updateMany(
//       // { userId: new Types.ObjectId(userId) },
//       { userId },
//       update,
//     );
//   }

//   async deleteAllComments() {
//     await this.model.deleteMany({}).exec();
//   }
// }
