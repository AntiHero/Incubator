import { LikeDTO, LikeDBType, LikeViewModel } from '../types';
import { PostLike } from '../entity/like.entity';

export class ConvertLikeData {
  static toDTO(like: (PostLike | LikeDBType) & { login: string }): LikeDTO {
    console.log(like.createdAt, typeof like.createdAt);
    return {
      id: String(like.id),
      userId: String(like.userId),
      entityId: String(like.entityId),
      likeStatus: like.likeStatus,
      login: like.login,
      isBanned: like.isBanned,
      addedAt:
        typeof like.createdAt === 'string'
          ? like.createdAt
          : like.createdAt.toISOString(),
    };
  }
  static toViewModel(like: LikeDTO): LikeViewModel {
    return {
      userId: like.userId,
      login: like.login,
      addedAt: like.addedAt,
    };
  }
}
