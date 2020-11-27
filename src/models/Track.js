const { gql } = require('apollo-server');
const { model, Schema } = require('mongoose');

module.exports = {
  model: model(
    'Track',
    new Schema({
      isMuted: Boolean,
      isSoloing: Boolean,
      songId: { ref: 'Song', type: Schema.Types.ObjectId },
      voice: {
        enum: [
          'FATSAWTOOTH',
          'FATSINE',
          'FATSQUARE',
          'FATTRIANGLE',
          'PULSE',
          'PWM',
          'SAWTOOTH',
          'SINE',
          'SQUARE',
          'TRIANGLE',
        ],
        type: String,
      },
      volume: Number,
    }),
  ),
  typeDef: gql`
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
  `,
};
