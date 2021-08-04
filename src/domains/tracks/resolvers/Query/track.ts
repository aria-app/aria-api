import { Track } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';

import { ApiContext } from '../../../../types';

type TrackResolver = (
  parent: Record<string, never>,
  args: {
    id: number;
  },
  context: ApiContext,
) => Promise<Track | null>;

export default <TrackResolver>(
  function track(_, { id }, { currentUser, prisma }) {
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
  }
);
