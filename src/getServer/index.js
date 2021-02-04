const { ApolloServer } = require('apollo-server');

const getContext = require('./getContext');
const getModels = require('./getModels');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

module.exports = function getServer({ db, skipAuth }) {
  return new ApolloServer({
    context: getContext({
      models: getModels(db),
      skipAuth,
    }),
    introspection: true,
    playground: true,
    resolvers,
    typeDefs,
  });
};
