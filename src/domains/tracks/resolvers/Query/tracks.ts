import { Track } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';

import ApiContext from '../../../../models/ApiContext';

type TracksResolver = (
  parent: Record<string, never>,
  args: {
    songId: number;
  },
  context: ApiContext,
) => Promise<Track[]>;

export default <TracksResolver>(
  function tracks(_, { songId }, { currentUser, prisma }) {
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
  }
);
