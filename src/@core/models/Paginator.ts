import { PaginatorType } from '../types';

class Paginator<T> implements PaginatorType<T> {
  public pagesCount: number;

  constructor(
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: T,
  ) {
    this.pagesCount = Math.ceil(totalCount / pageSize);
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = Number(totalCount);
    this.items = items;
  }
}

export default Paginator;
