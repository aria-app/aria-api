import { Prisma } from '@prisma/client';

export function makeSongInclude<T extends Prisma.SongInclude>(
  include: Prisma.Subset<T, Prisma.SongInclude>,
): T {
  return include;
}
