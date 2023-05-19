import {
  BlogDTO,
  BlogsWithImagesQueryResult,
  BlogViewModel,
  SubscriptionData,
} from '../types';
import { Blog } from '../entity/blog.entity';
import { ImageType } from 'root/@core/types/enum';

export class ConvertBlogData {
  static withImagesToDTO(blog: BlogsWithImagesQueryResult): BlogDTO {
    return {
      id: String(blog.id),
      posts: [],
      name: blog.name,
      websiteUrl: blog.websiteUrl,
      description: blog.description,
      userId: String(blog.userId),
      banInfo: {
        isBanned: blog.banInfo.isBanned,
        banDate:
          blog.banInfo.banDate === null
            ? null
            : new Date(blog.banInfo.banDate).toISOString(),
      },
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership,
      images: blog.images,
    };
  }

  static toDTO(blog: Blog & SubscriptionData): BlogDTO {
    return {
      id: String(blog.id),
      posts: [],
      name: blog.name,
      websiteUrl: blog.websiteUrl,
      description: blog.description,
      userId: String(blog.userId),
      subscribersCount: blog.subscribersCount,
      currentUserSubscriptionStatus: blog.currentUserSubscriptionStatus,
      banInfo: {
        isBanned: blog.banInfo.isBanned,
        banDate:
          blog.banInfo.banDate === null
            ? null
            : new Date(blog.banInfo.banDate).toISOString(),
      },
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership,
    };
  }

  static toView(blogDTO: BlogDTO): BlogViewModel {
    const noImage = {
      type: null,
      fileSize: null,
      height: null,
      width: null,
      url: null,
    };

    const { type: _, ...wallpaper } =
      blogDTO.images.find((img) => img.type === ImageType.wallpaper) ?? noImage;

    const { type: __, ...main } =
      blogDTO.images.find((img) => img.type === ImageType.main) ?? noImage;

    return {
      id: blogDTO.id,
      name: blogDTO.name,
      websiteUrl: blogDTO.websiteUrl,
      description: blogDTO.description,
      createdAt: blogDTO.createdAt,
      isMembership: blogDTO.isMembership,
      images: {
        wallpaper,
        main: [main],
      },
    };
  }
}
