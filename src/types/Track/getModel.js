const getCreateQuery = require('../../helpers/getCreateQuery');
const getUpdateQuery = require('../../helpers/getUpdateQuery');

module.exports = function getModel({ withTransaction }) {
  return {
    create(values) {
      return withTransaction((client) =>
        client.query(getCreateQuery('tracks', values), Object.values(values)),
      ).then((res) => res.rows[0]);
    },

    delete(id) {
      const query = `
      DELETE FROM tracks
      WHERE id = ${id};
    `;
      return withTransaction((client) => client.query(query)).then(
        (res) => res.rows[0],
      );
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
      const query = `SELECT * FROM tracks WHERE id = ${id} LIMIT 1;`;
      return withTransaction((client) => client.query(query)).then(
        (res) => res.rows[0],
      );
    },

    update(id, updates) {
      return withTransaction((client) =>
        client.query(
          getUpdateQuery('tracks', id, updates),
          Object.values(updates),
        ),
      ).then((res) => res.rows[0]);
    },
  };
};
