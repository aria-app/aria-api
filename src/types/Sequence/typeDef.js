const { gql } = require('apollo-server');

module.exports = gql`
  extend type Mutation {
    deleteSequence(id: ID!): DeleteSequenceResponse
    updateSequence(input: UpdateSequenceInput!): UpdateSequenceResponse
  }

  extend type Query {
    sequence(id: ID!): Sequence
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
