const { gql } = require('apollo-server');

module.exports = gql`
  extend type Mutation {
    updateNotesPoints(input: UpdateNotesPointsInput!): UpdateNotesPointsResponse
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
