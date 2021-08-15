import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Mutation {
    createSequence(input: CreateSequenceInput!): CreateSequenceResponse
    deleteSequence(id: Int!): DeleteSequenceResponse
    duplicateSequence(id: Int!): DuplicateSequenceResponse
    updateSequence(input: UpdateSequenceInput!): UpdateSequenceResponse
  }

  input CreateSequenceInput {
    position: Int!
    trackId: Int!
  }

  type CreateSequenceResponse {
    message: String!
    sequence: Sequence
  }

  type DeleteSequenceResponse {
    message: String!
    sequence: Sequence
  }

  type DuplicateSequenceResponse {
    message: String!
    sequence: Sequence
  }

  type Sequence {
    id: Int!
    measureCount: Int!
    notes: [Note]!
    position: Int!
    track: SequenceTrack!
  }

  type SequenceTrack {
    id: Int!
  }

  input UpdateSequenceInput {
    id: Int!
    measureCount: Int
    position: Int
  }

  type UpdateSequenceResponse {
    message: String!
    sequence: Sequence!
  }
`;
