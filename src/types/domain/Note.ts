import { ID } from './ID';
import { Point } from './Point';

interface NoteSequence {
  id: ID;
}

export interface Note {
  id: ID;
  points: Point[];
  sequence: NoteSequence;
}
