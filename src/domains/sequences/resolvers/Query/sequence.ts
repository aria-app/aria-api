import { Sequence } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';

import { Resolver } from '../../../../types';

interface SequenceVariables {
  id: number;
}

export const sequence: Resolver<Sequence | null, SequenceVariables> = async (
  parent,
  { id },
  { currentUser, prisma },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  return prisma.sequence.findUnique({
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
    where: { id },
  });
};
