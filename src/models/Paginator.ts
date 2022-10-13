import { Paginator as PaginatorInterface, h04, h05, h06 } from '@/@types';

class Paginator
  implements
    PaginatorInterface<
      | h04.BlogViewModel[]
      | h04.PostViewModel[]
      | h05.UserViewModel[]
      | h06.CommentViewModel[]
    >
{
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items:
      | h04.BlogViewModel[]
      | h04.PostViewModel[]
      | h05.UserViewModel[]
      | h06.CommentViewModel[]
  ) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}

export default Paginator;
