import { ID } from '../domain/ID';

export interface PrismaVoice {
  id: ID;
  name: string;
  toneOscillatorType: string;
}
