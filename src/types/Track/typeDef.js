const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    track(id: ID!): Track
    tracks(songId: ID!): [Track]!
  }

  type Track {
    id: ID!
    isMuted: Boolean!
    isSoloing: Boolean!
    sequences: [Sequence]!
    songId: ID!
    voice: Voice!
    volume: Int!
  }

  input TrackUpdateInput {
    isMuted: Boolean
    isSoloing: Boolean
    volume: Int
  }
`;
