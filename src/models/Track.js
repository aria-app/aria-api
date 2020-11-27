const { gql } = require('apollo-server');
const { model, ObjectId, Schema } = require('mongoose');
const Sequence = require('./Sequence');

module.exports = {
  model: model(
    'Track',
    new Schema({
      isMuted: Boolean,
      isSoloing: Boolean,
      sequences: [Sequence.model.schema],
      songId: ObjectId,
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
    type Track {
      id: ID!
      isMuted: Boolean!
      isSoloing: Boolean!
      sequences: [Sequence]
      songId: ID!
      voice: Voice!
      volume: Int!
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
