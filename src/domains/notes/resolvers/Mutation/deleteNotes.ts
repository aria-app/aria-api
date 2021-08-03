import { Note } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  ValidationError,
} from 'apollo-server';
import isEmpty from 'lodash/fp/isEmpty';

import { Resolver } from '../../../../models';

interface DeleteNotesResponse {
  message: string;
  notes: Note[];
  success: boolean;
}

interface DeleteNotesVariables {
  ids: number[];
}

export const deleteNotes: Resolver<
  DeleteNotesResponse,
  DeleteNotesVariables
> = async (_, { ids }, { currentUser, prisma }) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  if (isEmpty(ids)) {
    throw new ValidationError('Note IDs to delete must be provided.');
  }

  const notes = await prisma.note.findMany({ where: { id: { in: ids } } });

  if (isEmpty(notes) || notes.some((note) => !note)) {
    throw new ApolloError('Could not find all notes.');
  }

  const song = await prisma.note
    .findUnique({ where: { id: ids[0] } })
    .sequence()
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

  await prisma.note.deleteMany({ where: { id: { in: ids } } });

  await prisma.song.update({
    data: { updatedAt: new Date() },
    where: { id: song.id },
  });

  return {
    message: 'Notes were deleted successfully.',
    notes,
    success: true,
  };
};
