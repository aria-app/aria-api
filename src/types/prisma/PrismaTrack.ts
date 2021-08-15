import { ID } from '../domain/ID';
import { PrismaSequence } from './PrismaSequence';
import { PrismaVoice } from './PrismaVoice';

interface PrismaTrackSong {
  id: ID;
}

export interface PrismaTrack {
  id: ID;
  isMuted: boolean;
  isSoloing: boolean;
  position: number;
  sequences: PrismaSequence[];
  song: PrismaTrackSong | null;
  voice: PrismaVoice | null;
  volume: number;
}
