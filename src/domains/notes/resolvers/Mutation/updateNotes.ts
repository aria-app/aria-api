import { Note } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  ValidationError,
} from 'apollo-server';
import isEmpty from 'lodash/fp/isEmpty';

import { ApiContext } from '../../../../types';

interface UpdateNotesInput {
  notes: Note[];
}

interface UpdateNotesResponse {
  message: string;
  notes: Note[];
  success: boolean;
}

type UpdateNotesResolver = (
  parent: Record<string, never>,
  args: {
    input: UpdateNotesInput;
  },
  context: ApiContext,
) => Promise<UpdateNotesResponse>;

export default <UpdateNotesResolver>(
  async function updateNotes(_, { input }, { currentUser, prisma }) {
    const { notes } = input;

    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    if (isEmpty(notes)) {
      throw new ValidationError('Notes to update must be provided.');
    }

    const song = await prisma.note
      .findUnique({ where: { id: notes[0].id } })
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

    const updatedNotes = await Promise.all(
      notes.map((note) =>
        prisma.note.update({
          data: {
            points: note.points,
          },
          include: {
            sequence: {
              select: {
                id: true,
              },
            },
          },
          where: {
            id: note.id,
          },
        }),
      ),
    );

    await prisma.song.update({
      data: { updatedAt: new Date() },
      where: { id: song.id },
    });

    return {
      message: 'Notes were updated successfully.',
      notes: updatedNotes,
      success: true,
    };
  }
);
