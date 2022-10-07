export enum BlogFields {
  name = 'name',
  youtubeUrl = 'youtubeUrl',
  createdAt = 'createdAt',
}

export enum PostFields {
  title = 'title',
  content = 'content',
  blogId = 'blogId',
  blogName = 'blogName',
  shortDescription = 'shortDescription',
  createdAt = 'createdAt',
}

export enum Headers {
  'Authorization' = 'authorization',
}

export enum SortDirection {
  asc = 1,
  desc = -1,
}
  
export enum SortDirectionKeys {
  asc = 'asc',
  desc = 'desc'
}

export enum PaginationQueryParams {
  pageNumber = 'pageNumber',
  pageSize = 'pageSize',
  sortBy = 'sortBy',
  sortDirection = 'sortDirection',
  searchNameTerm = 'searchNameTerm'
}
