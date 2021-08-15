import { ApolloServer } from 'apollo-server';
import { ApolloServerExpressConfig } from 'apollo-server-express';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

type GetServer = (
  context: ApolloServerExpressConfig['context'],
) => ApolloServer;

export const getServer: GetServer = (context) => {
  return new ApolloServer({
    context,
    introspection: true,
    playground: true,
    resolvers,
    typeDefs,
  });
};
