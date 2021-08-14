import { ID } from './ID';
import { Note } from './Note';

export interface SequenceTrack {
  id: ID;
}

export interface Sequence {
  id: ID;
  measureCount: number;
  notes: Note[];
  position: number;
  track: SequenceTrack;
}
