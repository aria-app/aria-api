import { Voice } from '@prisma/client';

import { Resolver } from '../../../../types';

type VoiceResponse = Voice | null;

interface VoiceVariables {
  id: number;
}

export const voice: Resolver<VoiceResponse, VoiceVariables> = (
  parent,
  { id },
  { prisma },
) => prisma.voice.findUnique({ where: { id } });
