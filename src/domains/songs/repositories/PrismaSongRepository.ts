import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { isError, isNumber, isString } from 'lodash';

import { getSkip } from '../../../shared';
import { ID, Result, Song } from '../../../types';
import { makeSongInclude } from '../helpers';
import { mapPrismaSongToSongEntity } from '../mappers';
import { GetSongsOptions, SongRepository } from './SongRepository';

@injectable()
export class PrismaSongRepository implements SongRepository {
  constructor(@inject('PrismaClient') private prismaClient: PrismaClient) {}

  public async getSongById(id: ID): Promise<Result<Song>> {
    const prismaSong = await this.prismaClient.song.findUnique({
      include: getSongInclude(),
      where: { id },
    });

    if (!prismaSong) {
      return new Error('Song not found');
    }

    return mapPrismaSongToSongEntity(prismaSong);
  }

  public async getSongs({
    limit,
    page = 1,
    search,
    sort = 'name',
    sortDirection = 'asc',
    userId,
  }: GetSongsOptions): Promise<Result<Song[]>> {
    try {
      const orderBy = sort ? { [sort]: sortDirection } : undefined;
      const skip = getSkip(limit, page);
      const take = limit;
      const where = getSongWhereInput(userId, search);

      const prismaSongs = await this.prismaClient.song.findMany({
        include: getSongInclude(),
        orderBy,
        skip,
        take,
        where,
      });

      const songsMapResults = prismaSongs.map(mapPrismaSongToSongEntity);
      const mappedSongError = songsMapResults.find((songsMapResult) =>
        isError(songsMapResult),
      );

      if (isError(mappedSongError)) {
        return mappedSongError;
      }

      return songsMapResults as Song[];
    } catch (error) {
      return error;
    }
  }

  // public async getSongsCount({}: GetSongsOptions): Promise<Result<number>> {
  //   return 2;
  // }
}

function getSongInclude() {
  return makeSongInclude({
    tracks: {
      include: {
        sequences: {
          include: {
            notes: {
              include: {
                sequence: {
                  select: { id: true },
                },
              },
            },
            track: {
              select: { id: true },
            },
          },
        },
        song: {
          select: { id: true },
        },
        voice: true,
      },
    },
    user: {
      select: { id: true },
    },
  });
}

function getSongWhereInput(
  userId?: number,
  search?: string,
): Prisma.SongWhereInput {
  const searchFilter: Record<string, Prisma.StringFilter> = isString(search)
    ? {
        name: {
          contains: search || '',
          mode: 'insensitive',
        },
      }
    : {};
  const userIdFilter = isNumber(userId) ? { userId } : {};

  return {
    ...searchFilter,
    ...userIdFilter,
  };
}
