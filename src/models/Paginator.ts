import { Paginator as PaginatorInterface, h04 } from '@/@types';

class Paginator
  implements PaginatorInterface<h04.BlogViewModel[] | h04.PostViewModel[]> {
  constructor (
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: h04.BlogViewModel[] | h04.PostViewModel[]
  ) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}

export default Paginator;
