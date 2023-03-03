import { ConvertLikeData } from 'root/likes/utils/convertLike';
import { LikeStatuses } from 'root/@core/types/enum';
import { LikeViewModel } from 'root/likes/types';
import { Post } from '../entity/post.entity';

// TYPES
import type {
  PostsWithImagesQueryResultType,
  PostExtendedViewModel,
  PostExtendedLikesDTO,
  PostViewModel,
  PostDTO,
  PostsWithImagesDTO,
} from '../types';

export class ConvertPostData {
  static toDTO(
    post: Post | PostsWithImagesQueryResultType | PostsWithImagesDTO,
  ): PostDTO {
    const result: PostDTO = {
      id: String(post.id),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: String(post.blogId),
      createdAt:
        typeof post.createdAt === 'string'
          ? post.createdAt
          : post.createdAt.toISOString(),
    };

    if ('size' in post) {
      result.size = post.size;
    }

    if ('url' in post) {
      result.url = post.url;
    }

    if ('height' in post) {
      result.height = post.height;
    }

    if ('width' in post) {
      result.width = post.width;
    }

    return result;
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
        main: post.images.main,
      },
    };
  }
}
