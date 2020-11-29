const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    tracks: [Track]!
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
    sequences: [SequenceUpdateInput]
    voice: Voice
    volume: Int
  }

  enum Voice {
    FATSAWTOOTH
    FATSINE
    FATSQUARE
    FATTRIANGLE
    PULSE
    PWM
    SAWTOOTH
    SINE
    SQUARE
    TRIANGLE
  }
`;