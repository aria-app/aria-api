interface PaginatedResponseMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItemCount: number;
}

export default interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedResponseMetadata;
}
