import { Track } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import max from 'lodash/fp/max';

import constants from '../../../../constants';
import { ApiContext } from '../../../../types';

const { DEFAULT_VOICE_ID } = constants;

interface CreateTrackInput {
  songId: number;
}

interface CreateTrackResponse {
  message: string;
  success: boolean;
  track: Track;
}

type CreateTrackResolver = (
  parent: Record<string, never>,
  args: {
    input: CreateTrackInput;
  },
  context: ApiContext,
) => Promise<CreateTrackResponse>;

export default <CreateTrackResolver>(
  async function createTrack(parent, { input }, { currentUser, prisma }) {
    const { songId } = input;

    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.song.findUnique({
      where: {
        id: songId,
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
          id: songId,
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
            id: songId,
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
  }
);
