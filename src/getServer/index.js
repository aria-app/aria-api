const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const getContext = require('./getContext');
const getModels = require('./getModels');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

module.exports = function getServer({ db, skipAuth }) {
  return new ApolloServer({
    context: getContext({
      models: getModels(db),
      prisma: new PrismaClient(),
      skipAuth,
    }),
    introspection: true,
    playground: true,
    resolvers,
    typeDefs,
  });
};
