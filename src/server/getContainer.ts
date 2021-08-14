import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';

import { PrismaSongRepository, SongRepository } from '../domains';

export function getContainer(prismaClient: PrismaClient): Container {
  const container = new Container();

  container.bind<PrismaClient>('PrismaClient').toConstantValue(prismaClient);
  container.bind<SongRepository>(SongRepository).to(PrismaSongRepository);

  return container;
}
