import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    voices(sort: String, sortDirection: String): VoicesResponse!
  }

  type Voice {
    id: Int!
    name: String!
    toneOscillatorType: String!
  }

  type VoicesResponse {
    data: [Voice]!
    meta: PaginationMetadata
  }
`;
