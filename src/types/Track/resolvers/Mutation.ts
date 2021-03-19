import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  IResolverObject,
} from 'apollo-server';
import isNil from 'lodash/fp/isNil';
import max from 'lodash/fp/max';
import omitBy from 'lodash/fp/omitBy';

import constants from '../../../constants';
import ApiContext from '../../../models/ApiContext';

const { DEFAULT_VOICE_ID } = constants;

export default {
  createTrack: async (_, { input }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.song.findUnique({
      where: {
        id: parseInt(input.songId, 10),
      },
    });

    if (!song) {
      throw new ApolloError('Could not find corresponding song.');
    }

    if (currentUser.id !== song.userId) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    const otherTracks = await prisma.track.findMany({
      where: {
        song: {
          id: parseInt(input.songId, 10),
        },
      },
    });
    const prevMaxPosition =
      max(otherTracks.map((track) => track.position)) || 0;

    const newTrack = await prisma.track.create({
      data: {
        position: prevMaxPosition + 1,
        song: {
          connect: {
            id: parseInt(input.songId, 10),
          },
        },
        voice: {
          connect: {
            id: DEFAULT_VOICE_ID,
          },
        },
      },
      include: {
        sequences: true,
        song: true,
        voice: true,
      },
    });

    await prisma.song.update({
      data: { updatedAt: new Date() },
      where: { id: song.id },
    });

    return {
      message: 'Track was created successfully.',
      success: true,
      track: newTrack,
    };
  },

  deleteTrack: async (_, { id }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.track
      .findUnique({
        where: {
          id: parseInt(id, 10),
        },
      })
      .song();

    if (!song) {
      throw new ApolloError('Could not find corresponding song.');
    }

    if (currentUser.id !== song.userId) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    await prisma.track.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    await prisma.song.update({
      data: { updatedAt: new Date() },
      where: { id: song.id },
    });

    return {
      message: 'Track was deleted successfully.',
      success: true,
    };
  },

  updateTrack: async (_, { input }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.track
      .findUnique({
        where: {
          id: parseInt(input.id, 10),
        },
      })
      .song();

    if (!song) {
      throw new ApolloError('Could not find corresponding song.');
    }

    if (currentUser.id !== song.userId) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    const updatedTrack = await prisma.track.update({
      data: omitBy(isNil, {
        voice: input.voiceId
          ? {
              connect: {
                id: parseInt(input.voiceId, 10),
              },
            }
          : undefined,
        volume: input.volume,
      }),
      include: {
        sequences: true,
        song: true,
        voice: true,
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
      message: 'Track was updated successfully.',
      success: true,
      track: updatedTrack,
    };
  },
} as IResolverObject<any, ApiContext>;
