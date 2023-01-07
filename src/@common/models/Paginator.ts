import { PaginatorType } from '../types';

class Paginator<T> implements PaginatorType<T> {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: T,
  ) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = Number(totalCount);
    this.items = items;
  }
}

export default Paginator;
