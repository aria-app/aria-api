import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';

import getContext from './getContext';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

export default function getServer(
  { skipAuth } = { skipAuth: false },
): ApolloServer {
  return new ApolloServer({
    context: getContext({
      prisma: new PrismaClient(),
      skipAuth,
    }),
    introspection: true,
    playground: true,
    resolvers,
    typeDefs,
  });
}
