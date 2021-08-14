import { isNil } from 'lodash';

import { Note, PrismaSequence, Result, Sequence } from '../../../types';
import { mapPrismaNoteToNoteEntity } from '../../notes';

export function mapPrismaSequenceToSequenceEntity(
  prismaSequence: PrismaSequence,
): Result<Sequence> {
  if (isNil(prismaSequence)) {
    return new Error('Prisma sequence was null or undefined');
  }

  const { id, measureCount, notes, position, track } = prismaSequence;

  if (isNil(id)) {
    return new Error('Prisma sequence id was null or undefined');
  }

  if (isNil(measureCount)) {
    return new Error('Prisma sequence measureCount was null or undefined');
  }

  if (isNil(notes)) {
    return new Error('Prisma sequence notes was null or undefined');
  }

  if (isNil(position)) {
    return new Error('Prisma sequence position was null or undefined');
  }

  if (isNil(track)) {
    return new Error('Prisma sequence track was null or undefined');
  }

  const notesMapResults = notes.map(mapPrismaNoteToNoteEntity);
  const mappedNoteError = notesMapResults.find(
    (notesMapResult) => notesMapResult instanceof Error,
  );

  if (mappedNoteError instanceof Error) {
    return mappedNoteError;
  }

  return {
    id,
    measureCount,
    notes: notesMapResults as Note[],
    position,
    track,
  };
}
