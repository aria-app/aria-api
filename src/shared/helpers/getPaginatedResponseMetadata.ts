import { isNumber } from 'lodash';

import { PaginatedResponseMetadata } from '../../types';

export interface PaginatedResponseMetadataOptions {
  limit?: number;
  page?: number;
  totalItemCount: number;
}

export function getPaginatedResponseMetadata({
  limit,
  page,
  totalItemCount,
}: PaginatedResponseMetadataOptions): PaginatedResponseMetadata {
  return {
    currentPage: page || 1,
    itemsPerPage: isNumber(limit) ? limit : totalItemCount,
    totalItemCount,
  };
}
