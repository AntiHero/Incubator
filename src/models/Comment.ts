import { h06 } from '@/@types';

class Comment implements Omit<h06.CommentViewModel, 'id' | 'createdAt'> {
  public content;

  public userId;

  public userLogin;

  constructor({
    content,
    userId,
    userLogin,
  }: Omit<h06.CommentViewModel, 'id' | 'createdAt'>) {
    this.content = content;
    this.userId = userId;
    this.userLogin = userLogin;
  }
}

export default Comment;
