import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { isError, isNumber } from 'lodash';

import { getPaginatedResponseMetadata } from '../../../../shared';
import { PaginatedResponse, Resolver, Role, Song } from '../../../../types';
import { SongRepository } from '../../repositories';

interface SongsVariables {
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  sortDirection?: string;
  userId?: number;
}

export const songs: Resolver<PaginatedResponse<Song>, SongsVariables> = async (
  _,
  { limit, page, search, sort, sortDirection, userId },
  { container, currentUser, prisma },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  if (currentUser.role !== Role.ADMIN && !isNumber(userId)) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  if (
    currentUser.role !== Role.ADMIN &&
    userId &&
    String(currentUser.id) !== String(userId)
  ) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  const songRepository = container.get<SongRepository>(SongRepository);

  const getSongsResult = await songRepository.getSongs({
    limit,
    page,
    search,
    sort,
    sortDirection,
    userId,
  });

  if (isError(getSongsResult)) {
    throw getSongsResult;
  }

  const totalItemCount = await prisma.song.count({
    where: {
      name: {
        contains: search || '',
        mode: 'insensitive',
      },
      ...(isNumber(userId) ? { userId } : {}),
    },
  });

  return {
    data: getSongsResult,
    meta: getPaginatedResponseMetadata({ limit, page, totalItemCount }),
  };
};
