import { LikeViewModel } from 'root/likes/types';
import { LikeStatuses } from 'root/_common/types/enum';
import { PostDTO, PostExtendedLikesDTO, PostExtendedViewModel } from '../types';

export const convertToExtendedViewPostModel = (
  post: PostExtendedLikesDTO | PostDTO,
): PostExtendedViewModel => {
  let likesCount = 0;
  let dislikesCount = 0;
  let newestLikes: LikeViewModel[] = [];
  let myStatus: LikeStatuses = LikeStatuses.None;

  if ('likesCount' in post) {
    likesCount = post.likesCount;
  }

  if ('userStatus' in post) {
    myStatus = post.userStatus;
  }

  if ('dislikesCount' in post) {
    dislikesCount = post.dislikesCount;
  }

  if ('newestLikes' in post) {
    newestLikes = post.newestLikes;
  }

  return {
    id: post.id,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    title: post.title,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount,
      dislikesCount,
      newestLikes,
      myStatus,
    },
  };
};
