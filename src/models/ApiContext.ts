import { PrismaClient, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';

export default interface ApiContext extends ExpressContext {
  currentUser: User | null;
  isAuthenticated: boolean;
  prisma: PrismaClient;
}
