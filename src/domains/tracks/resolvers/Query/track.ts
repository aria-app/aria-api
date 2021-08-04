import { Track } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';

import { Resolver } from '../../../../types';

interface TrackVariables {
  id: number;
}

export const track: Resolver<Track | null, TrackVariables> = (
  _,
  { id },
  { currentUser, prisma },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  return prisma.track.findUnique({
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
      id,
    },
  });
};
