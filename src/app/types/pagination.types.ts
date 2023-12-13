export interface Pagination<T> {
  data: T[];
  pageSize: number;
  page: number;
  totalPages: number;
  count: number;
  totalCount: number;
}
