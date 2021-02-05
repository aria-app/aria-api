const { gql } = require('apollo-server');

module.exports = gql`
  extend type Mutation {
    createNote(input: CreateNoteInput!): CreateNoteResponse
    updateNotesPoints(input: UpdateNotesPointsInput!): UpdateNotesPointsResponse
  }

  input CreateNoteInput {
    points: [CreateNoteInputPoint]!
    sequenceId: ID!
  }

  input CreateNoteInputPoint {
    x: Int!
    y: Int!
  }

  type CreateNoteResponse {
    message: String!
    note: Note!
    success: Boolean!
  }

  type Note {
    id: ID!
    points: [Point]!
    sequence: Sequence!
  }

  type Point {
    x: Int!
    y: Int!
  }

  input UpdateNotesPointsInput {
    notes: [UpdateNotesPointsInputNote]!
  }

  input UpdateNotesPointsInputNote {
    id: ID!
    points: [UpdateNotesPointsInputNotePoint]!
  }

  input UpdateNotesPointsInputNotePoint {
    x: Int!
    y: Int!
  }

  type UpdateNotesPointsResponse {
    message: String!
    notes: [Note]!
    success: Boolean!
  }
`;
