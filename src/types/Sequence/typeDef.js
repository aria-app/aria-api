const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    sequence(id: ID!): Sequence
  }

  type Note {
    id: ID!
    points: [Point]
  }

  type Point {
    x: Int!
    y: Int!
  }

  type Sequence {
    id: ID!
    measureCount: Int!
    notes: [Note]
    position: Int!
    trackId: ID!
  }

  input NoteUpdateInput {
    points: [PointUpdateInput]
  }

  input PointUpdateInput {
    x: Int
    y: Int
  }

  input SequenceUpdateInput {
    measureCount: Int
    notes: [NoteUpdateInput]
    position: Int
  }
`;
