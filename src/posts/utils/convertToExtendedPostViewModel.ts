import { convertToLikeViewModel } from 'root/likes/utils/convertToLikeViewModel';
import { ImageConverter } from 'root/blogs/utils/imageConverter';
import { LikeStatuses } from 'root/@core/types/enum';
import { LikeViewModel } from 'root/likes/types';
import type {
  PostDTO,
  PostExtendedLikesDTO,
  PostExtendedViewModel,
} from '../types';

export const convertToExtendedViewPostModel = (
  post: PostExtendedLikesDTO | PostDTO,
): PostExtendedViewModel => {
  let likesCount = 0;
  let dislikesCount = 0;
  let newestLikes: LikeViewModel[] = [];
  let myStatus: LikeStatuses = LikeStatuses.None;

  if (post && 'likesCount' in post) {
    likesCount = post.likesCount;
  }

  if (post && 'userStatus' in post) {
    myStatus = post.userStatus;
  }

  if (post && 'dislikesCount' in post) {
    dislikesCount = post.dislikesCount;
  }

  if (post && 'newestLikes' in post) {
    newestLikes = post.newestLikes;
  }

  let images = [];

  if ('images' in post) {
    images = post.images.map(ImageConverter.toView);
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
      newestLikes: newestLikes.map(convertToLikeViewModel),
      myStatus,
    },
    images: {
      main: images,
    },
  };
};
