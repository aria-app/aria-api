const { gql } = require('apollo-server');

module.exports = gql`
  type Note {
    id: ID!
    points: [Point]
    sequence: Sequence!
  }

  type Point {
    x: Int!
    y: Int!
  }
`;
