import { isNil } from 'lodash';

import { Result, Song } from '../../types';

export function prismaSongToSongEntity({
  bpm,
  createdAt,
  id,
  measureCount,
  name,
  tracks,
  updatedAt,
  user,
}: any = {}): Result<Song> {
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

  return {
    bpm,
    createdAt,
    id,
    measureCount,
    name,
    tracks,
    updatedAt,
    user: {
      id: user.id,
    },
  };
}
