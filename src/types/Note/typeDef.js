const { gql } = require('apollo-server');

module.exports = gql`
  extend type Mutation {
    updateNote(input: UpdateNoteInput!): UpdateNoteResponse
  }

  type Note {
    id: ID!
    points: [Point]
    sequence: Sequence!
  }

  type Point {
    x: Int!
    y: Int!
  }

  input UpdateNoteInput {
    id: ID!
    points: [UpdateNotePointInput]
  }

  input UpdateNotePointInput {
    x: Int!
    y: Int!
  }

  type UpdateNoteResponse {
    message: String!
    note: Note!
    success: Boolean!
  }
`;
