import { Song } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import isNil from 'lodash/fp/isNil';
import omitBy from 'lodash/fp/omitBy';

import { Resolver } from '../../../../types';

interface UpdateSongResponse {
  message: string;
  song: Song;
  success: boolean;
}

interface UpdateSongVariables {
  input: {
    bpm?: number;
    id: number;
    measureCount?: number;
    name?: string;
  };
}

export const updateSong: Resolver<
  UpdateSongResponse,
  UpdateSongVariables
> = async (_, { input }, { currentUser, prisma }) => {
  const { bpm, id, measureCount, name } = input;

  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const song = await prisma.song.findUnique({
    where: { id },
  });

  if (!song) {
    throw new ApolloError(`Song with id ${id} not found.`);
  }

  if (currentUser.id !== song.userId) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  const updatedSong = await prisma.song.update({
    data: omitBy(isNil, {
      bpm,
      measureCount,
      name,
    }),
    include: {
      tracks: true,
      user: true,
    },
    where: {
      id,
    },
  });

  return {
    message: 'Song was updated successfully.',
    song: updatedSong,
    success: true,
  };
};
