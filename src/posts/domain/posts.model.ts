import { PostDomainModel } from '../types';
import { Comment } from 'root/comments/domain/comments.model';
import { Like } from 'root/likes/domain/likes.model';

type PostModelType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};

export class Post implements PostDomainModel {
  public title: string;

  public shortDescription: string;

  public content: string;

  public blogId: string;

  public blogName: string;

  public comments: Comment[] = [];

  public likes: Like[] = [];

  constructor({
    title,
    shortDescription,
    content,
    blogId,
    blogName,
  }: PostModelType) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
  }
}
