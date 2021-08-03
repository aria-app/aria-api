import { Role, Song } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import isNil from 'lodash/fp/isNil';

import ApiContext from '../../../../models/ApiContext';
import PaginatedResponse from '../../../../models/PaginatedResponse';

type SongResolver = (
  parent: Record<string, never>,
  args: {
    id: number;
  },
  context: ApiContext,
) => Promise<Song>;

export default <SongResolver>(
  async function song(_, { id }, { currentUser, prisma }) {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const foundSong = await prisma.song.findUnique({
      include: {
        tracks: {
          include: {
            sequences: {
              include: {
                notes: {
                  include: {
                    sequence: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
                track: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            song: {
              select: {
                id: true,
              },
            },
            voice: true,
          },
        },
        user: true,
      },
      where: { id },
    });

    if (!foundSong) {
      throw new ApolloError('Song was not found', 'NOT_FOUND');
    }

    if (
      currentUser.role !== Role.ADMIN &&
      String(currentUser.id) !== String(foundSong.userId)
    ) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    return foundSong;
  }
);

type SongsResolver = (
  parent: Record<string, never>,
  args: {
    limit?: number;
    page?: number;
    search?: string;
    sort?: string;
    sortDirection?: string;
    userId?: number;
  },
  context: ApiContext,
) => Promise<PaginatedResponse<Song>>;

export const songs: SongsResolver = async (
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
