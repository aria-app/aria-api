import { gql } from 'apollo-server';

export const typeDef = gql`
  extend type Query {
    sequence(id: Int!): Sequence
  }

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
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
  }

  type DeleteSequenceResponse {
    message: String!
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
  }

  type DuplicateSequenceResponse {
    message: String!
    sequence: Sequence
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
  }

  type Sequence {
    id: Int!
    measureCount: Int!
    notes: [Note]!
    position: Int!
    track: Track!
  }

  input UpdateSequenceInput {
    id: Int!
    measureCount: Int
    position: Int
  }

  type UpdateSequenceResponse {
    message: String!
    sequence: Sequence!
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
  }
`;
