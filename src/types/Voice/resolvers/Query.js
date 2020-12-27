const model = require('../model');

module.exports = {
  voice: (_, { id }) => model.findOneById(id),
};
