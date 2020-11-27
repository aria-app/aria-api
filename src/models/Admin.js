const { model, Schema } = require('mongoose');

module.exports = {
  model: model(
    'Admin',
    new Schema({
      userId: { ref: 'User', type: Schema.Types.ObjectId },
    }),
  ),
};
