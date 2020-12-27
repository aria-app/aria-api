const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    note(id: ID!): Note
  }

  type Note {
    id: ID!
    points: [Point]
    sequenceId: ID!
  }

  type Point {
    x: Int!
    y: Int!
  }
`;
