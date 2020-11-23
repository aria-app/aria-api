const { model, Schema } = require('mongoose');

module.exports = model(
  'Song',
  new Schema({
    name: String,
  }),
);
