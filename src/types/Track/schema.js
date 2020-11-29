const { Schema } = require('mongoose');

module.exports = new Schema({
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
});
