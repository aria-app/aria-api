import { ID } from './ID';
import { Sequence } from './Sequence';
import { Voice } from './Voice';

interface TrackSong {
  id: ID;
}

export interface Track {
  id: ID;
  isMuted: boolean;
  isSoloing: boolean;
  position: number;
  sequences: Sequence[];
  song: TrackSong;
  voice: Voice;
  volume: number;
}
