const { gql } = require('apollo-server');

module.exports = gql`
  extend type Mutation {
    createNote(input: CreateNoteInput!): CreateNoteResponse
    deleteNotes(ids: [ID]!): DeleteNotesResponse
    updateNotes(input: UpdateNotesInput!): UpdateNotesResponse
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

  type DeleteNotesResponse {
    message: String!
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

  input UpdateNotesInput {
    notes: [UpdateNotesInputNote]!
  }

  input UpdateNotesInputNote {
    id: ID!
    points: [UpdateNotesInputNotePoint]!
    sequenceId: ID!
  }

  input UpdateNotesInputNotePoint {
    x: Int!
    y: Int!
  }

  type UpdateNotesResponse {
    message: String!
    notes: [Note]!
    success: Boolean!
  }
`;
