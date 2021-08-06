import { Track } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';

import { Resolver } from '../../../../types';

export interface TracksVariables {
  songId: number;
}

export const tracks: Resolver<Track[], TracksVariables> = (
  _,
  { songId },
  { currentUser, prisma },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  return prisma.track.findMany({
    include: {
      sequences: {
        include: {
          track: {
            select: {
              id: true,
            },
          },
        },
      },
      song: true,
      voice: true,
    },
    where: {
      song: {
        id: songId,
      },
    },
  });
};
