import { Role, Song } from '@prisma/client';
import { AuthenticationError, ForbiddenError } from 'apollo-server';
import isNil from 'lodash/fp/isNil';

import { PaginatedResponse, Resolver } from '../../../../types';

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
  { limit, page = 1, search, sort = 'name', sortDirection = 'asc', userId },
  { currentUser, prisma },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  if (
    currentUser.role !== Role.ADMIN &&
    userId &&
    String(currentUser.id) !== String(userId)
  ) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  const filteredUserId =
    currentUser.role !== Role.ADMIN || userId
      ? userId || currentUser.id
      : undefined;

  const songsPage = await prisma.song.findMany({
    include: {
      tracks: {
        select: {
          id: true,
        },
      },
      user: true,
    },
    orderBy: {
      [sort]: sortDirection,
    },
    ...(!isNil(limit)
      ? {
          skip: (page - 1) * limit,
          take: limit,
        }
      : {}),
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      userId: filteredUserId,
    },
  });

  const totalItemCount = await prisma.song.count({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      userId: filteredUserId,
    },
  });

  return {
    data: songsPage,
    meta: {
      currentPage: page,
      itemsPerPage: isNil(limit) ? totalItemCount : limit,
      totalItemCount,
    },
  };
};
