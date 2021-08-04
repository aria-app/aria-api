import { Song } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';

import { ApiContext } from '../../../../types';

interface DeleteSongResponse {
  message: string;
  song: Song;
  success: boolean;
}

type DeleteSongResolver = (
  parent: Record<string, never>,
  args: {
    id: number;
  },
  context: ApiContext,
) => Promise<DeleteSongResponse>;

export const deleteSong: DeleteSongResolver = async (
  _,
  { id },
  { currentUser, prisma },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const song = await prisma.song.findUnique({
    where: { id },
  });

  if (!song) {
    throw new ApolloError('Could not find song.');
  }

  if (String(currentUser.id) !== String(song.userId)) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  await prisma.song.delete({
    where: { id },
  });

  return {
    message: 'Song was deleted successfully.',
    song,
    success: true,
  };
};
