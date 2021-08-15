import { Prisma } from '@prisma/client';
import { isString } from 'lodash';

export function getOrderBy(
  sort?: string,
  sortDirection?: string,
): Record<string, Prisma.SortOrder> {
  return isString(sort) ? { [sort]: getSafeSortDirection(sortDirection) } : {};
}

function getSafeSortDirection(rawSortDirection?: string): Prisma.SortOrder {
  return rawSortDirection === 'desc' ? 'desc' : 'asc';
}
