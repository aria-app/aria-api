import { isNil } from 'lodash';

import { PrismaTrack, Result, Sequence, Track } from '../../../types';
import { mapPrismaSequenceToSequenceEntity } from '../../sequences';

export function mapPrismaTrackToTrackEntity(
  prismaTrack: PrismaTrack,
): Result<Track> {
  if (isNil(prismaTrack)) {
    return new Error('Prisma track was null or undefined');
  }

  const {
    id,
    isMuted,
    isSoloing,
    position,
    sequences,
    song,
    voice,
    volume,
  } = prismaTrack;

  if (isNil(id)) {
    return new Error('Prisma track id was null or undefined');
  }

  if (isNil(isMuted)) {
    return new Error('Prisma track isMuted was null or undefined');
  }

  if (isNil(isSoloing)) {
    return new Error('Prisma track isSoloing was null or undefined');
  }

  if (isNil(position)) {
    return new Error('Prisma track position was null or undefined');
  }

  if (isNil(sequences)) {
    return new Error('Prisma track sequences was null or undefined');
  }

  if (isNil(song)) {
    return new Error('Prisma track song was null or undefined');
  }

  if (isNil(voice)) {
    return new Error('Prisma track voice was null or undefined');
  }

  if (isNil(volume)) {
    return new Error('Prisma track volume was null or undefined');
  }

  const sequencesMapResults = sequences.map(mapPrismaSequenceToSequenceEntity);
  const mappedSequenceError = sequencesMapResults.find(
    (sequencesMapResult) => sequencesMapResult instanceof Error,
  );

  if (mappedSequenceError instanceof Error) {
    return mappedSequenceError;
  }

  return {
    id,
    isMuted,
    isSoloing,
    position,
    sequences: sequencesMapResults as Sequence[],
    song,
    voice,
    volume,
  };
}
