import { PrismaClient, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import { Container } from 'inversify';

export interface ApiContext extends ExpressContext {
  container: Container;
  currentUser: User | null;
  isAuthenticated: boolean;
  prisma: PrismaClient;
}
