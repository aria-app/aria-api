import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { isError } from 'lodash';

import { getOrderBy, getSkip, getTake } from '../../../shared';
import { Result, Voice } from '../../../types';
import { mapPrismaVoiceToVoiceEntity } from '../mappers';
import { GetVoicesOptions, VoiceRepository } from './VoiceRepository';

@injectable()
export class PrismaVoiceRepository implements VoiceRepository {
  constructor(@inject('PrismaClient') private prismaClient: PrismaClient) {}

  public async getVoices({
    limit,
    page,
    sort,
    sortDirection,
  }: GetVoicesOptions): Promise<Result<Voice[]>> {
    try {
      const prismaVoices = await this.prismaClient.voice.findMany({
        orderBy: getOrderBy(sort, sortDirection),
        skip: getSkip(limit, page),
        take: getTake(limit),
      });

      const voicesMapResults = prismaVoices.map(mapPrismaVoiceToVoiceEntity);
      const mappedVoiceError = voicesMapResults.find((voicesMapResult) =>
        isError(voicesMapResult),
      );

      if (isError(mappedVoiceError)) {
        return mappedVoiceError;
      }

      return voicesMapResults as Voice[];
    } catch (error) {
      return error;
    }
  }

  public async getVoicesCount(): Promise<Result<number>> {
    try {
      return this.prismaClient.voice.count();
    } catch (error) {
      return error;
    }
  }
}
