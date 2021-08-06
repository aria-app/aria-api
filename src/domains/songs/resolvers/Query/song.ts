import { Role, Song } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';

import { Resolver } from '../../../../types';

interface SongVariables {
  id: number;
}

export const song: Resolver<Song | null, SongVariables> = async (
  _,
  { id },
  { currentUser, prisma },
) => {
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
};
