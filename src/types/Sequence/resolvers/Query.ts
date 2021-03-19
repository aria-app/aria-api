import { IResolverObject } from 'apollo-server';

import ApiContext from '../../../models/ApiContext';

export default {
  sequence: (_, { id }, { prisma }) =>
    prisma.sequence.findUnique({
      include: {
        notes: {
          include: {
            sequence: {
              select: {
                id: true,
              },
            },
          },
        },
        track: true,
      },
      where: { id: parseInt(id, 10) },
    }),
} as IResolverObject<any, ApiContext>;
