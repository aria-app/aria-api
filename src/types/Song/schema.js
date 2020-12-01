const { Schema } = require('mongoose');

module.exports = new Schema({
  bpm: Number,
  dateModified: Date,
  measureCount: Number,
  name: String,
  userId: { ref: 'User', type: Schema.Types.ObjectId },
});
