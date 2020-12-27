const getCreateQuery = require('../../helpers/getCreateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create(values) {
    return withTransaction((client) =>
      client.query(getCreateQuery('voices', values), Object.values(values)),
    );
  },

  findAll() {
    return withTransaction((client) => client.query('SELECT * FROM voices;'));
  },

  findOneById(id) {
    const query = `
      SELECT *
      FROM voices
      WHERE id = ${id}
      LIMIT 1;
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0],
    );
  },
};
