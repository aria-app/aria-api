import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    currentUser: User
    user(id: Int!): User
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
    token: String
    user: User
  }

  type LogoutResponse {
    success: Boolean!
  }

  type RegisterResponse {
    expiresAt: Int
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
    id: Int!
    lastName: String
  }

  type UpdateUserResponse {
    message: String!
    user: User
  }

  type User {
    email: String!
    firstName: String!
    id: Int!
    lastName: String!
    role: Role!
  }

  type UsersResponse {
    data: [User]!
    meta: PaginationMetadata
  }
`;
