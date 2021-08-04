import { Song } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';

import { ApiContext } from '../../../../types';

const DEFAULT_BPM = 120;
const DEFAULT_MEASURE_COUNT = 4;

interface CreateSongInput {
  name: string;
}

interface CreateSongResponse {
  message: string;
  song: Song;
  success: boolean;
}

type CreateSongResolver = (
  parent: Record<string, never>,
  args: {
    input: CreateSongInput;
  },
  context: ApiContext,
) => Promise<CreateSongResponse>;

export default <CreateSongResolver>(
  async function createSong(_, { input }, { currentUser, prisma }) {
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
  }
);
