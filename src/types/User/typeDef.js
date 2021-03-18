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
    login(email: String!, password: String!): LoginResponse
    logout: LogoutResponse
    register(
      email: String!
      firstName: String!
      lastName: String!
      password: String!
    ): RegisterResponse
    updateUser(input: UpdateUserInput!): UpdateUserResponse
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

  enum Role {
    ADMIN
    USER
  }

  input UpdateUserInput {
    email: String
    firstName: String
    id: ID!
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
    lastName: String!
    role: Role!
  }

  type UsersResponse {
    data: [User]!
    meta: PaginationMetadata
  }
`;
