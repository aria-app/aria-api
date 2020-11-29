const { Schema } = require('mongoose');

module.exports = new Schema({
  userId: { ref: 'User', type: Schema.Types.ObjectId },
});
