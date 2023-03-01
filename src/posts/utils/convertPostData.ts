import {
  PostDTO,
  PostViewModel,
  PostExtendedLikesDTO,
  PostExtendedViewModel,
} from '../types';
import { Post } from '../entity/post.entity';
import { LikeViewModel } from 'root/likes/types';
import { LikeStatuses } from 'root/@core/types/enum';
import { ConvertLikeData } from 'root/likes/utils/convertLike';

export class ConvertPostData {
  static toDTO(post: Post): PostDTO {
    return {
      id: String(post.id),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: String(post.blogId),
      createdAt: post.createdAt.toISOString(),
    };
  }
  static toViewModel(post: PostDTO): PostViewModel {
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogName: post.blogName,
      blogId: post.blogId,
      createdAt: post.createdAt,
    };
  }
  static toExtendedViewModel(
    post: PostExtendedLikesDTO,
  ): PostExtendedViewModel {
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
        newestLikes: newestLikes.map(ConvertLikeData.toViewModel),
        myStatus,
      },
      images: {
        main: [],
      },
    };
  }
}
