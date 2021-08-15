import { Track } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import isNil from 'lodash/fp/isNil';
import omitBy from 'lodash/fp/omitBy';

import { Resolver } from '../../../../../../types';

interface UpdateTrackResponse {
  message: string;
  success: boolean;
  track: Track;
}

interface UpdateTrackVariables {
  input: {
    id: number;
    voiceId?: number;
    volume?: number;
  };
}

export const updateTrack: Resolver<
  UpdateTrackResponse,
  UpdateTrackVariables
> = async (parent, { input }, { currentUser, prisma }) => {
  const { id, voiceId, volume } = input;

  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const track = await prisma.track.findUnique({
    where: {
      id,
    },
  });

  if (!track) {
    throw new ApolloError('Could not find track.');
  }

  const song = await prisma.track
    .findUnique({
      where: {
        id,
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
      voice: voiceId
        ? {
            connect: {
              id: voiceId,
            },
          }
        : undefined,
      volume,
    }),
    include: {
      sequences: true,
      song: true,
      voice: true,
    },
    where: {
      id,
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
};
