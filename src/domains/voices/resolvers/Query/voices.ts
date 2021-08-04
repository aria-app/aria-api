import { Voice } from '@prisma/client';

import { ApiContext } from '../../../../types';

type VoicesResolver = (
  parent: Record<string, never>,
  args: Record<string, never>,
  context: ApiContext,
) => Promise<Voice[] | null>;

export default <VoicesResolver>function voices(parent, args, { prisma }) {
  return prisma.voice.findMany({ orderBy: { name: 'asc' } });
};
