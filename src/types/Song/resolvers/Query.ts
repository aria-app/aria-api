import { Role } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  IResolverObject,
} from 'apollo-server';
import isNil from 'lodash/fp/isNil';

import ApiContext from '../../../models/ApiContext';

export default {
  song: async (_, { id }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.song.findUnique({
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
      where: { id: parseInt(id, 10) },
    });

    if (!song) {
      throw new ApolloError('Song was not found', 'NOT_FOUND');
    }

    if (
      currentUser.role !== Role.ADMIN &&
      String(currentUser.id) !== String(song.userId)
    ) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    return song;
  },

  songs: async (
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
        ? parseInt(userId || currentUser.id, 10)
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
  },
} as IResolverObject<any, ApiContext>;
