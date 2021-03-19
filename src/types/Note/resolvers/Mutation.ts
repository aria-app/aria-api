import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  IResolverObject,
  ValidationError,
} from 'apollo-server';
import isEmpty from 'lodash/fp/isEmpty';

import ApiContext from '../../../models/ApiContext';

export default {
  createNote: async (_, { input }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.sequence
      .findUnique({
        where: {
          id: parseInt(input.sequenceId, 10),
        },
      })
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
        points: input.points,
        sequence: {
          connect: {
            id: parseInt(input.sequenceId, 10),
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
  },

  deleteNotes: async (_, { ids }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    if (isEmpty(ids)) {
      throw new ValidationError('Note IDs to delete must be provided.');
    }

    const song = await prisma.note
      .findUnique({
        where: {
          id: parseInt(ids[0], 10),
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

    await prisma.note.deleteMany({
      where: {
        id: { in: ids.map((id) => parseInt(id, 10)) },
      },
    });

    await prisma.song.update({
      data: { updatedAt: new Date() },
      where: { id: song.id },
    });

    return {
      message: 'Notes were deleted successfully.',
      success: true,
    };
  },

  duplicateNotes: async (_, { ids }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    if (isEmpty(ids)) {
      throw new ValidationError('Note IDs to duplicate must be provided.');
    }

    const song = await prisma.note
      .findUnique({
        where: {
          id: parseInt(ids[0], 10),
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

    const notes = await prisma.note.findMany({
      where: {
        id: { in: ids.map((id) => parseInt(id, 10)) },
      },
    });

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
  },

  updateNotes: async (_, { input }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    if (isEmpty(input.notes)) {
      throw new ValidationError('Notes to update must be provided.');
    }

    const song = await prisma.note
      .findUnique({
        where: {
          id: parseInt(input.notes[0].id, 10),
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

    const updatedNotes = await Promise.all(
      input.notes.map((note) =>
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
            id: parseInt(note.id, 10),
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
  },
} as IResolverObject<any, ApiContext>;
