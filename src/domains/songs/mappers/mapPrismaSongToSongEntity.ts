import { isNil } from 'lodash';

import { PrismaSong, Result, Song, Track } from '../../../types';
import { mapPrismaTrackToTrackEntity } from '../../tracks';

export function mapPrismaSongToSongEntity(
  prismaSong: PrismaSong,
): Result<Song> {
  if (!prismaSong) {
    return new Error('Prisma song was null or undefined');
  }

  const {
    bpm,
    createdAt,
    id,
    measureCount,
    name,
    tracks,
    updatedAt,
    user,
  } = prismaSong;

  if (isNil(bpm)) {
    return new Error('Prisma song bpm was null or undefined');
  }

  if (isNil(createdAt)) {
    return new Error('Prisma song createdAt was null or undefined');
  }

  if (isNil(id)) {
    return new Error('Prisma song id was null or undefined');
  }

  if (isNil(measureCount)) {
    return new Error('Prisma song measureCount was null or undefined');
  }

  if (isNil(name)) {
    return new Error('Prisma song name was null or undefined');
  }

  if (isNil(tracks)) {
    return new Error('Prisma song tracks was null or undefined');
  }

  if (isNil(updatedAt)) {
    return new Error('Prisma song updatedAt was null or undefined');
  }

  if (isNil(user)) {
    return new Error('Prisma song user was null or undefined');
  }

  const tracksMapResults = tracks.map(mapPrismaTrackToTrackEntity);
  const mappedTrackError = tracksMapResults.find(
    (tracksMapResult) => tracksMapResult instanceof Error,
  );

  if (mappedTrackError instanceof Error) {
    return mappedTrackError;
  }

  return {
    bpm,
    createdAt,
    id,
    measureCount,
    name,
    tracks: tracksMapResults as Track[],
    updatedAt,
    user: {
      id: user.id,
    },
  };
}
