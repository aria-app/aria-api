import { Song, Track } from '@prisma/client';

import { Resolver } from '../../../../types';

export const createdAt: Resolver<
  string,
  Record<string, never>,
  Song & { tracks: Track[] }
> = async (parent) => parent.createdAt.toISOString();

export const trackCount: Resolver<
  number,
  Record<string, never>,
  Song & { tracks: Track[] }
> = async (parent) => parent.tracks.length;

export const updatedAt: Resolver<
  string,
  Record<string, never>,
  Song & { tracks: Track[] }
> = async (parent) => parent.updatedAt.toISOString();
