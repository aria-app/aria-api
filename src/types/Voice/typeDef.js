const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    voice(id: ID!): Voice
  }

  type Voice {
    id: ID!
    name: String!
    toneOscillatorType: String!
  }
`;