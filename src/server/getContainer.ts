import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';

import {
  PrismaSongRepository,
  PrismaUserRepository,
  PrismaVoiceRepository,
  SongRepository,
  UserRepository,
  VoiceRepository,
} from '../domains';

export function getContainer(prismaClient: PrismaClient): Container {
  const container = new Container();

  container.bind<PrismaClient>('PrismaClient').toConstantValue(prismaClient);
  container.bind<SongRepository>(SongRepository).to(PrismaSongRepository);
  container.bind<UserRepository>(UserRepository).to(PrismaUserRepository);
  container.bind<VoiceRepository>(VoiceRepository).to(PrismaVoiceRepository);

  return container;
}
