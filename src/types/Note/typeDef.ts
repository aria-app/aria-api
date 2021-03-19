import { gql } from 'apollo-server';

export default gql`
  extend type Mutation {
    createNote(input: CreateNoteInput!): CreateNoteResponse
    deleteNotes(ids: [ID]!): DeleteNotesResponse
    duplicateNotes(ids: [ID]!): DuplicateNotesResponse
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

  type DuplicateNotesResponse {
    message: String!
    notes: [Note]!
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
