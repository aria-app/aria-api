import { Song, Track } from '@prisma/client';
import { IResolverObject } from 'apollo-server';

import ApiContext from '../../../models/ApiContext';

export default {
  createdAt: (song) => song.createdAt.toISOString(),
  trackCount: (song) => song.tracks.length,
  updatedAt: (song) => song.updatedAt.toISOString(),
} as IResolverObject<Song & { tracks: Track[] }, ApiContext>;
