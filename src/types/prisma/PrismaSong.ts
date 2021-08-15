import { ID } from '../domain/ID';
import { PrismaTrack } from './PrismaTrack';

interface PrismaSongUser {
  id: ID;
}

export interface PrismaSong {
  bpm: number;
  createdAt: Date;
  id: ID;
  measureCount: number;
  name: string;
  tracks: PrismaTrack[];
  updatedAt: Date;
  user: PrismaSongUser | null;
}
