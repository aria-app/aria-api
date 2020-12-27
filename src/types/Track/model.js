const getCreateQuery = require('../../helpers/getCreateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create(values) {
    return withTransaction((client) =>
      client.query(getCreateQuery('tracks', values), Object.values(values)),
    ).then((res) => res.rows[0]);
  },

  findBySongId(song_id) {
    const query = `
      SELECT *
      FROM tracks
      WHERE song_id = ${song_id};
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows,
    );
  },

  findOneById(id) {
    const query = `
      SELECT *
      FROM tracks
      WHERE id = ${id}
      LIMIT 1;
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0],
    );
  },
};
