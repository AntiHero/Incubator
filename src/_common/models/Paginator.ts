import { PaginatorType } from '../types';
import { BlogViewModel } from 'root/blogs/types';
import { PostViewModel } from 'root/posts/types';

class Paginator implements PaginatorType<BlogViewModel[] | PostViewModel[]> {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: BlogViewModel[] | PostViewModel[],
  ) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}

export default Paginator;
