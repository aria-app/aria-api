import { Song, Track } from '@prisma/client';

type CreatedAtResolver = (parent: Song & { tracks: Track[] }) => string;

export const createdAt: CreatedAtResolver = (parent) => {
  return parent.createdAt.toISOString();
};

type TrackCountResolver = (parent: Song & { tracks: Track[] }) => number;

export const trackCount: TrackCountResolver = (parent) => {
  return parent.tracks.length;
};

type UpdatedAtResolver = (parent: Song & { tracks: Track[] }) => string;

export const updatedAt: UpdatedAtResolver = (parent) => {
  return parent.updatedAt.toISOString();
};
