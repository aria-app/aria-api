const { Schema } = require('mongoose');

const noteSchema = new Schema({
  points: [
    {
      x: Number,
      y: Number,
    },
  ],
});

module.exports = new Schema({
  measureCount: Number,
  notes: [noteSchema],
  position: Number,
  trackId: { ref: 'Track', type: Schema.Types.ObjectId },
});
