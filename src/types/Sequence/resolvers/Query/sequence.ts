import { Sequence } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';

import ApiContext from '../../../../models/ApiContext';

type SequenceResolver = (
  parent: Record<string, never>,
  args: {
    id: number;
  },
  context: ApiContext,
) => Promise<Sequence>;

export default <SequenceResolver>(
  async function sequence(parent, { id }, { currentUser, prisma }) {
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
  }
);
