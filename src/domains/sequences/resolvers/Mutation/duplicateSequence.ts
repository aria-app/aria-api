import { Sequence } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';

import { Resolver } from '../../../../types';

interface DuplicateSequenceResponse {
  message: string;
  sequence: Sequence;
  success: boolean;
}

interface DuplicateSequenceVariables {
  id: number;
}

export const duplicateSequence: Resolver<
  DuplicateSequenceResponse,
  DuplicateSequenceVariables
> = async (_, { id }, { currentUser, prisma }) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const sequence = await prisma.sequence.findUnique({ where: { id } });

  if (!sequence) {
    throw new ApolloError('Could not find sequence.');
  }

  const song = await prisma.sequence
    .findUnique({ where: { id } })
    .track()
    .song();

  if (!song) {
    throw new ApolloError('Could not find corresponding song.');
  }

  if (currentUser.id !== song.userId) {
    throw new ForbiddenError(
      'Logged in user does not have permission to edit this song.',
    );
  }

  const sequenceNotes = await prisma.note.findMany({
    where: {
      sequence: {
        id,
      },
    },
  });

  const newSequence = await prisma.sequence.create({
    data: {
      measureCount: sequence.measureCount,
      position: sequence.position,
      trackId: sequence.trackId,
    },
    include: {
      track: true,
    },
  });

  const newNotes = await Promise.all(
    sequenceNotes.map((note) =>
      prisma.note.create({
        data: {
          points: JSON.stringify(note.points),
          sequence: {
            connect: {
              id: newSequence.id,
            },
          },
        },
        include: {
          sequence: {
            select: {
              id: true,
            },
          },
        },
      }),
    ),
  );

  await prisma.song.update({
    data: { updatedAt: new Date() },
    where: { id: song.id },
  });

  return {
    message: 'Sequence was duplicated successfully.',
    sequence: {
      ...newSequence,
      notes: newNotes,
    },
    success: true,
  };
};
