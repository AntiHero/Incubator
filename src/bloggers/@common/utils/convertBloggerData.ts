import { BloggerCommentDTO } from '../types';
import { BlogCommentType } from 'root/blogs/types';

export class ConvertBloggerData {
  static toDTO() {
    return null;
  }
  static toViewModel() {
    return null;
  }
  static toBloggerCommentDTO(
    blogPostComment: BlogCommentType,
  ): BloggerCommentDTO {
    return {
      id: String(blogPostComment.id),
      blogId: String(blogPostComment.blogId),
      blogName: blogPostComment.blogName,
      title: blogPostComment.title,
      postId: String(blogPostComment.postId),
      createdAt: blogPostComment.createdAt,
      likesCount: blogPostComment.likesCount,
      dislikesCount: blogPostComment.dislikesCount,
      userStatus: blogPostComment.userStatus,
      content: blogPostComment.content,
      userId: String(blogPostComment.userId),
      isBanned: blogPostComment.isBanned,
      userLogin: blogPostComment.userLogin,
    };
  }
}
