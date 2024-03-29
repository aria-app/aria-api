import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type PaginationMetadata {
    currentPage: Int!
    itemsPerPage: Int!
    totalItemCount: Int!
  }
`;
