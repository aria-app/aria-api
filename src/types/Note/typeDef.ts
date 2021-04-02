import { gql } from 'apollo-server';

export default gql`
  extend type Mutation {
    createNote(input: CreateNoteInput!): CreateNoteResponse
    deleteNotes(ids: [Int!]!): DeleteNotesResponse
    duplicateNotes(ids: [Int!]!): DuplicateNotesResponse
    updateNotes(input: UpdateNotesInput!): UpdateNotesResponse
  }

  input CreateNoteInput {
    points: [CreateNoteInputPoint]!
    sequenceId: Int!
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

  type DuplicateNotesResponse {
    message: String!
    notes: [Note]!
    success: Boolean!
  }

  type Note {
    id: Int!
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
    id: Int!
    points: [UpdateNotesInputNotePoint]!
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
