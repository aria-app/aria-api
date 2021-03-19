import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import isNil from 'lodash/fp/isNil';
import omitBy from 'lodash/fp/omitBy';

const DEFAULT_BPM = 120;
const DEFAULT_MEASURE_COUNT = 4;

export default {
  createSong: async (_, { options }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const newSong = await prisma.song.create({
      data: {
        bpm: DEFAULT_BPM,
        measureCount: DEFAULT_MEASURE_COUNT,
        userId: currentUser.id,
        ...options,
      },
      include: {
        tracks: true,
        user: true,
      },
    });

    return {
      message: 'Song was created successfully.',
      song: newSong,
      success: true,
    };
  },

  deleteSong: async (_, { id }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.song.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (String(currentUser.id) !== String(song.userId)) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    await prisma.song.delete({
      where: { id: parseInt(id, 10) },
    });

    return {
      message: 'Song was deleted successfully.',
      success: true,
    };
  },

  updateSong: async (_, { input }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.song.findUnique({
      where: { id: parseInt(input.id, 10) },
    });

    if (!song) {
      throw new ApolloError(`Song with id ${input.id} not found.`);
    }

    if (currentUser.id !== song.userId) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    const updatedSong = await prisma.song.update({
      data: omitBy(isNil, {
        bpm: input.bpm,
        measureCount: input.measureCount,
        name: input.name,
      }),
      include: {
        tracks: true,
        user: true,
      },
      where: {
        id: parseInt(input.id, 10),
      },
    });

    return {
      message: 'Song was updated successfully.',
      song: updatedSong,
      success: true,
    };
  },
};
