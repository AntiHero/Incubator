import { PostLike } from '../entity/like.entity';
import { LikeDTO, LikeViewModel } from '../types';

export class ConvertLikeData {
  static toDTO(like: PostLike & { login: string }): LikeDTO {
    return {
      id: String(like.id),
      userId: String(like.userId),
      entityId: String(like.entityId),
      likeStatus: like.likeStatus,
      login: like.login,
      isBanned: like.isBanned,
      addedAt: like.createdAt.toISOString(),
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
