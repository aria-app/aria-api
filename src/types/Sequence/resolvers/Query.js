const model = require('../model');

module.exports = {
  sequence: (_, { id }) => model.findOneById(id),
};
