const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    sequence(id: ID!): Sequence
  }

  extend type Mutation {
    createSequence(input: CreateSequenceInput!): CreateSequenceResponse
    deleteSequence(id: ID!): DeleteSequenceResponse
    updateSequence(input: UpdateSequenceInput!): UpdateSequenceResponse
  }

  input CreateSequenceInput {
    position: Int!
    trackId: ID!
  }

  type CreateSequenceResponse {
    message: String!
    song: Sequence
    success: Boolean!
  }

  type DeleteSequenceResponse {
    message: String!
    success: Boolean!
  }

  type Sequence {
    id: ID!
    measureCount: Int!
    notes: [Note]!
    position: Int!
    track: Track!
  }

  input UpdateSequenceInput {
    id: ID!
    measureCount: Int
    position: Int
  }

  type UpdateSequenceResponse {
    message: String!
    sequence: Sequence!
    success: Boolean!
  }
`;
