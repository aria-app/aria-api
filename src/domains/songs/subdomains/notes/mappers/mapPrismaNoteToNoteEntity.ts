import { isArray, isError, isNil } from 'lodash';

import { Note, Point, PrismaNote, Result } from '../../../../../types';
import { mapPrismaPointToPointEntity } from './mapPrismaPointToPointEntity';

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

  if (!isArray(points)) {
    return new Error('Prisma note points were not an array');
  }

  if (isNil(sequence)) {
    return new Error('Prisma note sequence was null or undefined');
  }

  const pointsMapResults = points.map(mapPrismaPointToPointEntity);
  const mappedPointError = pointsMapResults.find((pointsMapResult) =>
    isError(pointsMapResult),
  );

  if (isError(mappedPointError)) {
    return mappedPointError;
  }

  return {
    id,
    points: pointsMapResults as Point[],
    sequence,
  };
}
