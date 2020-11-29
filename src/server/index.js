const { ApolloServer } = require('apollo-server');

const context = require('./context');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

module.exports = new ApolloServer({
  context,
  introspection: true,
  playground: true,
  resolvers,
  typeDefs,
});
