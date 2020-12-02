const { Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new Schema({
  bpm: Number,
  dateModified: Date,
  measureCount: Number,
  name: String,
  userId: { ref: 'User', type: Schema.Types.ObjectId },
});

schema.plugin(mongoosePaginate);

module.exports = schema;
