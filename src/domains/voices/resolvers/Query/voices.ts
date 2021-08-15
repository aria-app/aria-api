import { Voice } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';
import { isError } from 'lodash';

import { getPaginatedResponseMetadata } from '../../../../shared';
import { PaginatedResponse, Resolver } from '../../../../types';
import { VoiceRepository } from '../../repositories';

interface VoicesVariables {
  limit?: number;
  page: number;
  sort: string;
  sortDirection: string;
}

export const voices: Resolver<
  PaginatedResponse<Voice>,
  VoicesVariables
> = async (
  parent,
  { limit, page, sort, sortDirection },
  { container, currentUser },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const voiceRepository = container.get<VoiceRepository>(VoiceRepository);

  const getVoicesResult = await voiceRepository.getVoices({
    limit,
    page,
    sort,
    sortDirection,
  });

  if (isError(getVoicesResult)) {
    throw getVoicesResult;
  }

  const getVoicesCountResult = await voiceRepository.getVoicesCount();

  if (isError(getVoicesCountResult)) {
    throw getVoicesCountResult;
  }

  return {
    data: getVoicesResult,
    meta: getPaginatedResponseMetadata({
      limit,
      page,
      totalItemCount: getVoicesCountResult,
    }),
  };
};
