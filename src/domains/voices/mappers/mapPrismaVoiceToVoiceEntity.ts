import { isNil } from 'lodash';

import { PrismaVoice, Result, Voice } from '../../../types';

export function mapPrismaVoiceToVoiceEntity(
  prismaVoice: PrismaVoice,
): Result<Voice> {
  if (!prismaVoice) {
    return new Error('Prisma voice was null or undefined');
  }

  const { id, name, toneOscillatorType } = prismaVoice;

  if (isNil(id)) {
    return new Error('Prisma voice id was null or undefined');
  }

  if (isNil(name)) {
    return new Error('Prisma voice name was null or undefined');
  }

  if (isNil(toneOscillatorType)) {
    return new Error('Prisma voice toneOscillatorType was null or undefined');
  }

  return {
    id,
    name,
    toneOscillatorType,
  };
}
