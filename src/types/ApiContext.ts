import { PrismaClient, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';

import { Repositories } from '../domains';

export interface ApiContext extends ExpressContext {
  currentUser: User | null;
  isAuthenticated: boolean;
  prisma: PrismaClient;
  repositories: Repositories;
}
