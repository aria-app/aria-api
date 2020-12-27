const getCreateQuery = require('../../helpers/getCreateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create(values) {
    return withTransaction((client) =>
      client.query(getCreateQuery('sequences', values), Object.values(values)),
    ).then((res) => res.rows[0]);
  },

  findByTrackId(track_id) {
    const query = `
      SELECT *
      FROM sequences
      WHERE track_id = ${track_id};
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows,
    );
  },

  findOneById(id) {
    const query = `
      SELECT *
      FROM sequences
      WHERE id = ${id}
      LIMIT 1;
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0],
    );
  },
};
