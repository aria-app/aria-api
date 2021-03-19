const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const getContext = require('./getContext');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

module.exports = function getServer({ skipAuth } = {}) {
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
};
