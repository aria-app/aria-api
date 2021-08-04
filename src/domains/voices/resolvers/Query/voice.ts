import { Voice } from '@prisma/client';

import { ApiContext } from '../../../../types';

type VoiceResolver = (
  parent: Record<string, never>,
  args: {
    id: number;
  },
  context: ApiContext,
) => Promise<Voice | null>;

export default <VoiceResolver>function voice(parent, { id }, { prisma }) {
  return prisma.voice.findUnique({ where: { id } });
};
