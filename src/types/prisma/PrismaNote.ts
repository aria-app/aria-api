import { Prisma } from '@prisma/client';

import { ID } from '../domain/ID';

interface PrismaNoteSequence {
  id: ID;
}

export interface PrismaNote {
  id: ID;
  points: Prisma.JsonArray;
  sequence: PrismaNoteSequence | null;
}
