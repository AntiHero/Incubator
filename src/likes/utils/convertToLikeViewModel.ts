import { LikeDTO, LikeViewModel } from '../types';

export const convertToLikeViewModel = (like: LikeDTO): LikeViewModel => {
  const view = { ...like };
  delete view.entityId;
  delete view.id;
  delete view.likeStatus;

  return like;
};
