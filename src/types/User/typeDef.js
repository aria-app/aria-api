const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users(
      limit: Int
      page: Int
      search: String
      sort: String
      sortDirection: String
    ): UsersResponse!
  }

  extend type Mutation {
    deleteUser(id: ID!): DeleteUserResponse
    login(email: String!, password: String!): LoginResponse
    logout: LogoutResponse
    register(
      email: String!
      firstName: String!
      lastName: String!
      password: String!
    ): RegisterResponse
    updateUser(id: ID!, updates: UpdateUserInput!): UpdateUserResponse
  }

  type DeleteUserResponse {
    message: String!
    success: Boolean!
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

  input UpdateUserInput {
    email: String
    firstName: String
    lastName: String
  }

  type UpdateUserResponse {
    message: String!
    success: Boolean!
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
