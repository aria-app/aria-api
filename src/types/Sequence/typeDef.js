const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    sequence(id: ID!): Sequence
  }

  type Sequence {
    id: ID!
    measureCount: Int!
    notes: [Note]!
    position: Int!
    track: Track!
  }

  input SequenceUpdateInput {
    measureCount: Int
    position: Int
  }
`;
