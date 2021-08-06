import { Song } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';

import { DEFAULT_BPM, DEFAULT_MEASURE_COUNT } from '../../../../constants';
import { Resolver } from '../../../../types';

interface CreateSongInput {
  name: string;
}

interface CreateSongResponse {
  message: string;
  song: Song;
  success: boolean;
}

interface CreateSongVariables {
  input: CreateSongInput;
}

export const createSong: Resolver<
  CreateSongResponse,
  CreateSongVariables
> = async (_, { input }, { currentUser, prisma }) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const newSong = await prisma.song.create({
    data: {
      bpm: DEFAULT_BPM,
      measureCount: DEFAULT_MEASURE_COUNT,
      userId: currentUser.id,
      ...input,
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
};
