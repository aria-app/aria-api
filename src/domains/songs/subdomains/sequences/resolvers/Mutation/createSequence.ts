import { Sequence } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';

import { Resolver } from '../../../../../../types';

interface CreateSequenceResponse {
  message: string;
  sequence: Sequence;
  success: boolean;
}

interface CreateSequenceVariables {
  input: {
    position: number;
    trackId: number;
  };
}

export const createSequence: Resolver<
  CreateSequenceResponse,
  CreateSequenceVariables
> = async (_, { input }, { currentUser, prisma }) => {
  const { position, trackId } = input;

  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const song = await prisma.track.findUnique({ where: { id: trackId } }).song();

  if (!song) {
    throw new ApolloError('Could not find corresponding song.');
  }

  if (currentUser.id !== song.userId) {
    throw new ForbiddenError(
      'Logged in user does not have permission to edit this song.',
    );
  }

  const newSequence = await prisma.sequence.create({
    data: {
      measureCount: 1,
      position,
      track: {
        connect: {
          id: trackId,
        },
      },
    },
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
  });

  await prisma.song.update({
    data: { updatedAt: new Date() },
    where: { id: song.id },
  });

  return {
    message: 'Sequence was created successfully.',
    sequence: newSequence,
    success: true,
  };
};
