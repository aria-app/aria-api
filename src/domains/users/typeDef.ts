import { gql } from 'apollo-server';

export const typeDef = gql`
  extend type Query {
    currentUser: User
    me: User @deprecated(reason: "Use the currentUser query instead.")
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
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
    token: String
    user: User
  }

  type LogoutResponse {
    success: Boolean!
  }

  type RegisterResponse {
    expiresAt: Int
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
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
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
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
