import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';

import { ApiContext } from '../types';
import { getContext } from './getContext';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

type GetServer = (options: {
  prismaClient: PrismaClient;
  repositories: ApiContext['repositories'];
  skipAuth: boolean;
}) => ApolloServer;

export const getServer: GetServer = ({
  prismaClient,
  repositories,
  skipAuth,
}) => {
  return new ApolloServer({
    context: getContext({
      prisma: prismaClient,
      repositories,
      skipAuth,
    }),
    introspection: true,
    playground: true,
    resolvers,
    typeDefs,
  });
};
