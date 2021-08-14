import { AuthenticationError, ForbiddenError } from 'apollo-server';

import { Resolver, Role, Song } from '../../../../types';

interface SongVariables {
  id: number;
}

export const song: Resolver<Song | null, SongVariables> = async (
  _,
  { id },
  { currentUser, repositories: { songRepository } },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const getSongByIdResult = await songRepository.getSongById(id);

  if (getSongByIdResult instanceof Error) {
    throw getSongByIdResult;
  }

  if (
    currentUser.role !== Role.ADMIN &&
    String(currentUser.id) !== String(getSongByIdResult.user.id)
  ) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  return getSongByIdResult;
};
