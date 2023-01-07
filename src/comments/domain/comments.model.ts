import { CommentDomainModel } from 'root/comments/types';

export class Comment implements CommentDomainModel {
  public content: string;

  public userId: string;

  public userLogin: string;

  constructor({ content, userId, userLogin }: CommentDomainModel) {
    this.content = content;
    this.userId = userId;
    this.userLogin = userLogin;
  }
}
