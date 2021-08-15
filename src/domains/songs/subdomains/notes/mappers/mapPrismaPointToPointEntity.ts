import { Prisma } from '@prisma/client';
import { isNil, isNumber } from 'lodash';

import { Point, Result } from '../../../../../types';

export function mapPrismaPointToPointEntity(
  prismaPoint: Prisma.JsonValue,
): Result<Point> {
  if (isNil(prismaPoint)) {
    return new Error('Prisma point was null or undefined');
  }

  const { x, y } = prismaPoint as Prisma.JsonObject;

  if (isNil(x)) {
    return new Error('Prisma point x coordinate was null or undefined');
  }

  if (!isNumber(x)) {
    return new Error('Prisma point x coordinate must be a number');
  }

  if (isNil(y)) {
    return new Error('Prisma point y coordinate was null or undefined');
  }

  if (!isNumber(y)) {
    return new Error('Prisma point y coordinate must be a number');
  }

  return { x, y };
}
