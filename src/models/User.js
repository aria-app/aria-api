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
      me: User
      users: [User]!
    }

    extend type Mutation {
      login(email: String!): LoginResponse
      register(email: String!): RegisterResponse
    }

    type LoginResponse {
      success: Boolean!
      token: String
      user: User
    }

    type RegisterResponse {
      success: Boolean!
      token: String
    }

    type User {
      email: String!
      firstName: String
      id: ID!
      lastName: String
    }
  `,
};
