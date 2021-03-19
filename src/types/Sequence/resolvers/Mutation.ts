const { AuthenticationError, ForbiddenError } = require('apollo-server');
const isNil = require('lodash/fp/isNil');
const omitBy = require('lodash/fp/omitBy');

export default {
  createSequence: async (_, { input }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.track
      .findUnique({
        where: {
          id: parseInt(input.trackId, 10),
        },
      })
      .song();

    if (currentUser.id !== song.userId) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    const newSequence = await prisma.sequence.create({
      data: {
        measureCount: 1,
        position: input.position,
        track: {
          connect: {
            id: parseInt(input.trackId, 10),
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
  },

  deleteSequence: async (_, { id }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.sequence
      .findUnique({
        where: {
          id: parseInt(id, 10),
        },
      })
      .track()
      .song();

    if (currentUser.id !== song.userId) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    await prisma.sequence.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    return {
      message: 'Sequence was deleted successfully.',
      success: true,
    };
  },

  duplicateSequence: async (_, { id }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.sequence
      .findUnique({
        where: {
          id: parseInt(id, 10),
        },
      })
      .track()
      .song();

    if (currentUser.id !== song.userId) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    const sequence = await prisma.sequence.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    const sequenceNotes = await prisma.note.findMany({
      where: {
        sequence: {
          id: parseInt(id, 10),
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
                id: parseInt(newSequence.id, 10),
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
  },

  updateSequence: async (_, { input }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.sequence
      .findUnique({
        where: {
          id: parseInt(input.id, 10),
        },
      })
      .track()
      .song();

    if (currentUser.id !== song.userId) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    const updatedSequence = await prisma.sequence.update({
      data: omitBy(isNil, {
        measureCount: input.measureCount,
        position: input.position,
      }),
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
      where: {
        id: parseInt(input.id, 10),
      },
    });

    await prisma.song.update({
      data: { updatedAt: new Date() },
      where: { id: song.id },
    });

    return {
      message: 'Sequence was updated successfully.',
      sequence: updatedSequence,
      success: true,
    };
  },
};
