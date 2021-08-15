import { ID } from './ID';
import { Track } from './Track';

interface SongUser {
  id: ID;
}

export interface Song {
  bpm: number;
  createdAt: Date;
  id: ID;
  measureCount: number;
  name: string;
  tracks: Track[];
  updatedAt: Date;
  user: SongUser;
}
