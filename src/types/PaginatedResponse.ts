export interface PaginatedResponseMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItemCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedResponseMetadata;
}
