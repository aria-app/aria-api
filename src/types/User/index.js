const model = require('./model');
const pgModel = require('./pgModel');
const resolvers = require('./resolvers');
const schema = require('./schema');
const typeDef = require('./typeDef');

module.exports = {
  model,
  pgModel,
  resolvers,
  schema,
  typeDef,
};
