import { Blog } from '../entity/blog.entity';
import { BlogDTO, BlogViewModel } from '../types';

export class ConvertBlogData {
  static toDTO(blog: Blog): BlogDTO {
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
    };
  }
  static toView(blogDTO: BlogDTO): BlogViewModel {
    return {
      id: blogDTO.id,
      name: blogDTO.name,
      websiteUrl: blogDTO.websiteUrl,
      description: blogDTO.description,
      createdAt: blogDTO.createdAt,
      isMembership: blogDTO.isMembership,
    };
  }
}
