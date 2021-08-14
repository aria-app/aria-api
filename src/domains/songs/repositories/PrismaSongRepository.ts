import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { ID, Result, Song } from '../../../types';
import { mapPrismaSongToSongEntity } from '../mappers';
import { SongRepository } from './SongRepository';

@injectable()
export class PrismaSongRepository implements SongRepository {
  constructor(@inject('PrismaClient') private prismaClient: PrismaClient) {}

  public async getSongById(id: ID): Promise<Result<Song>> {
    const prismaSong = await this.prismaClient.song.findUnique({
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

    if (!prismaSong) {
      return new Error('Song not found');
    }

    return mapPrismaSongToSongEntity(prismaSong);
  }
}
