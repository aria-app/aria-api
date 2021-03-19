import { IResolverObject } from 'apollo-server';

import ApiContext from '../../../models/ApiContext';

export default {
  track: (_, { id }, { prisma }) =>
    prisma.track.findUnique({
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
        id: parseInt(id, 10),
      },
    }),

  tracks: (_, { songId }, { prisma }) =>
    prisma.track.findMany({
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
          id: parseInt(songId, 10),
        },
      },
    }),
} as IResolverObject<any, ApiContext>;
