import { ID } from '../domain/ID';
import { PrismaNote } from './PrismaNote';

export interface PrismaSequenceTrack {
  id: ID;
}

export interface PrismaSequence {
  id: ID;
  measureCount: number;
  notes: PrismaNote[];
  position: number;
  track: PrismaSequenceTrack | null;
}
