import { isNumber } from 'lodash';

export function getTake(limit?: number): number | undefined {
  return isNumber(limit) ? limit : undefined;
}
