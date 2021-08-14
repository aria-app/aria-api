import { Prisma } from '@prisma/client';
import { isNil, isNumber } from 'lodash';

import { Note, Point, PrismaNote, Result } from '../../../types';

function mapPrismaPointToPointEntity(
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

export function mapPrismaNoteToNoteEntity(
  prismaNote: PrismaNote,
): Result<Note> {
  if (isNil(prismaNote)) {
    return new Error('Prisma note was null or undefined');
  }

  const { id, points, sequence } = prismaNote;

  if (isNil(id)) {
    return new Error('Prisma note id was null or undefined');
  }

  if (isNil(points)) {
    return new Error('Prisma note points was null or undefined');
  }

  if (isNil(sequence)) {
    return new Error('Prisma note sequence was null or undefined');
  }

  const pointsMapResults = points.map(mapPrismaPointToPointEntity);
  const mappedPointError = pointsMapResults.find(
    (pointsMapResult) => pointsMapResult instanceof Error,
  );

  if (mappedPointError instanceof Error) {
    return mappedPointError;
  }

  return {
    id,
    points: pointsMapResults as Point[],
    sequence,
  };
}
