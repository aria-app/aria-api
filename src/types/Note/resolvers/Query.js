const pgModel = require('../pgModel');

module.exports = {
  note: (_, { id }) => pgModel.findOneById(id),
};
