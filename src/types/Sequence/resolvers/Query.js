const pgModel = require('../pgModel');

module.exports = {
  sequence: (_, { id }) => pgModel.findOneById(id),
};
