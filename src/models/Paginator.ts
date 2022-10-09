import { Paginator as PaginatorInterface, h04, h05 } from '@/@types';

class Paginator
  implements
    PaginatorInterface<
      h04.BlogViewModel[] | h04.PostViewModel[] | h05.UserViewModel[]
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
  ) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}

export default Paginator;
