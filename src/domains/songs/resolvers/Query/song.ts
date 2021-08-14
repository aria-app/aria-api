import { AuthenticationError, ForbiddenError } from 'apollo-server';

import { Resolver, Role, Song } from '../../../../types';
import { SongRepository } from '../../repositories';

interface SongVariables {
  id: number;
}

export const song: Resolver<Song | null, SongVariables> = async (
  _,
  { id },
  { container, currentUser },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const songRepository = container.get<SongRepository>(SongRepository);
  const songOrError = await songRepository.getSongById(id);

  if (songOrError instanceof Error) {
    throw songOrError;
  }

  if (
    currentUser.role !== Role.ADMIN &&
    currentUser.id !== songOrError.user.id
  ) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  return songOrError;
};
