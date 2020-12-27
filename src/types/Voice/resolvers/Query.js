const pgModel = require('../pgModel');

module.exports = {
  voice: (_, { id }) => pgModel.findOneById(id),
};
