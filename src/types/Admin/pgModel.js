const getCreateQuery = require('../../helpers/getCreateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create(values) {
    return withTransaction((client) =>
      client.query(getCreateQuery('admins', values), Object.values(values)),
    );
  },

  findAll() {
    return withTransaction((client) => client.query('SELECT * FROM admins;'));
  },
};
