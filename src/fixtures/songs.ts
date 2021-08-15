import { parseISO } from 'date-fns';

import { Song } from '../src/types';

export const songs: Song[] = [
  {
    bpm: 100,
    createdAt: parseISO('2021-02-04'),
    id: 1,
    measureCount: 1,
    name: 'Dummy Song',
    tracks: [],
    updatedAt: parseISO('2021-02-04'),
    user: {
      id: 1,
    },
  },
];
