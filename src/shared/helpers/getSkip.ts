import { isNumber } from 'lodash';

export function getSkip(limit?: number, page?: number): number {
  return isNumber(limit) && isNumber(page) ? (page - 1) * limit : 0;
}
