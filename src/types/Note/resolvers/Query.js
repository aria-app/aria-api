const model = require('../model');

module.exports = {
  note: (_, { id }) => model.findOneById(id),
};
