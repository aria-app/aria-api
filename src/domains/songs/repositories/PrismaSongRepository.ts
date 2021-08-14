import { PrismaClient } from '@prisma/client';

import { ID, Result, Song } from '../../../types';
import { prismaSongToSongEntity } from '../mappers';
import { SongRepository } from './SongRepository';

export class PrismaSongRepository implements SongRepository {
  constructor(private prismaClient: PrismaClient) {}

  async getSongById(id: ID): Promise<Result<Song>> {
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

    return prismaSongToSongEntity(prismaSong);
  }
}
