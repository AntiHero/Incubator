import { LikeDTO, LikeViewModel } from '../types';

export const convertToLikeViewModel = (like: LikeDTO): LikeViewModel => {
  const { login, addedAt, userId } = like;

  return { login, addedAt, userId };
};
