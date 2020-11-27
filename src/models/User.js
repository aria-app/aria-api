const { gql } = require('apollo-server');
const { model, Schema } = require('mongoose');

module.exports = {
  model: model(
    'User',
    new Schema({
      email: String,
      firstName: String,
      lastName: String,
    }),
  ),
  typeDef: gql`
    extend type Query {
      users: [User]!
    }

    type User {
      email: String!
      firstName: String!
      id: ID!
      lastName: String!
    }
  `,
};
