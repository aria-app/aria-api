import { Note, Prisma } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';

import { Resolver } from '../../../../../../types';

interface CreateNoteResponse {
  message: string;
  note: Note;
  success: boolean;
}

interface CreateNoteVariables {
  input: {
    points: Prisma.JsonArray;
    sequenceId: number;
  };
}

export const createNote: Resolver<
  CreateNoteResponse,
  CreateNoteVariables
> = async (_, { input }, { currentUser, prisma }) => {
  const { points, sequenceId } = input;

  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const song = await prisma.sequence
    .findUnique({ where: { id: sequenceId } })
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

  const newNote = await prisma.note.create({
    data: {
      points,
      sequence: {
        connect: {
          id: sequenceId,
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
  });

  await prisma.song.update({
    data: { updatedAt: new Date() },
    where: { id: song.id },
  });

  return {
    message: 'Note was created successfully.',
    note: newNote,
    success: true,
  };
};
