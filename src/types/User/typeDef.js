const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    me: User
    users(
      limit: Int
      page: Int
      search: String
      sort: String
      sortDirection: String
    ): UsersResponse!
  }

  extend type Mutation {
    login(email: String!, password: String!): LoginResponse
    logout: LogoutResponse
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

  type LogoutResponse {
    success: Boolean!
  }

  type RegisterResponse {
    expiresAt: Int
    success: Boolean!
    token: String
    user: User
  }

  type User {
    email: String!
    firstName: String!
    id: ID!
    isAdmin: Boolean!
    lastName: String!
  }

  type UsersResponse {
    data: [User]!
    meta: PaginationMetadata
  }
`;
