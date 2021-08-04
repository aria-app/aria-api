import { Note } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  ValidationError,
} from 'apollo-server';
import isEmpty from 'lodash/fp/isEmpty';

import { ApiContext } from '../../../../types';

interface DuplicateNotesResponse {
  message: string;
  notes: Note[];
  success: boolean;
}

type DuplicateNotesResolver = (
  parent: Record<string, never>,
  args: {
    ids: number[];
  },
  context: ApiContext,
) => Promise<DuplicateNotesResponse>;

export default <DuplicateNotesResolver>(
  async function duplicateNotes(_, { ids }, { currentUser, prisma }) {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    if (isEmpty(ids)) {
      throw new ValidationError('Note IDs to duplicate must be provided.');
    }

    const song = await prisma.note
      .findUnique({
        where: {
          id: ids[0],
        },
      })
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

    const notes = await prisma.note.findMany({ where: { id: { in: ids } } });

    const newNotes = await Promise.all(
      notes.map((note) =>
        prisma.note.create({
          data: {
            points: note.points,
            sequence: {
              connect: {
                id: note.sequenceId || 0,
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
      message: 'Notes were duplicated successfully.',
      notes: newNotes,
      success: true,
    };
  }
);
