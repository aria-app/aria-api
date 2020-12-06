const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    users: [User]!
  }

  extend type Mutation {
    login(email: String!, password: String!): LoginResponse
    register(
      email: String!
      firstName: String!
      lastName: String!
      password: String!
    ): RegisterResponse
  }

  type LoginResponse {
    expiresAt: Int
    success: Boolean!
    token: String
    user: User
  }

  type RegisterResponse {
    expiresAt: Int
    success: Boolean!
    token: String
    user: User
  }

  type User {
    email: String!
    firstName: String
    id: ID!
    isAdmin: Boolean!
    lastName: String
  }
`;
