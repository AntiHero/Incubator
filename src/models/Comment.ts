import { CommentModelType, LikeStatus, h06, h11 } from '@/@types';

class Comment implements Omit<CommentModelType, 'createdAt'> {
  public content;

  public userId;

  public userLogin;

  public likesInfo: h11.LikesInfoViewModel;

  constructor({
    content,
    userId,
    userLogin,
  }: Omit<h06.CommentViewModel, 'id' | 'createdAt'>) {
    this.content = content;
    this.userId = userId;
    this.userLogin = userLogin;
    this.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.None,
    };
  }
}

export default Comment;
