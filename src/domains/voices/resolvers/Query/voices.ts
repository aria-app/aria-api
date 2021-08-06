import { Voice } from '@prisma/client';

import { Resolver } from '../../../../types';

type VoicesResponse = Voice[];

type VoicesVariables = Record<string, never>;

export const voices: Resolver<VoicesResponse, VoicesVariables> = (
  parent,
  args,
  { prisma },
) => prisma.voice.findMany({ orderBy: { name: 'asc' } });
