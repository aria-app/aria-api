const { gql } = require('apollo-server');

module.exports = gql`
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
  }

  type RegisterResponse {
    success: Boolean!
    token: String
  }

  type User {
    email: String!
    firstName: String
    id: ID!
    isAdmin: Boolean!
    lastName: String
  }
`;
