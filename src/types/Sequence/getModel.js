const getCreateQuery = require('../../helpers/getCreateQuery');
const getUpdateQuery = require('../../helpers/getUpdateQuery');

module.exports = function getModel({ withTransaction }) {
  return {
    create(values) {
      return withTransaction((client) =>
        client.query(
          getCreateQuery('sequences', values),
          Object.values(values),
        ),
      ).then((res) => res.rows[0]);
    },

    delete(id) {
      const query = `
      DELETE FROM sequences
      WHERE id = ${id};
    `;
      return withTransaction((client) => client.query(query)).then(
        (res) => res.rows[0],
      );
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
      const query = `SELECT * FROM sequences WHERE id = ${id} LIMIT 1;`;
      return withTransaction((client) => client.query(query)).then(
        (res) => res.rows[0],
      );
    },

    update(id, updates) {
      return withTransaction((client) =>
        client.query(
          getUpdateQuery('sequences', id, updates),
          Object.values(updates),
        ),
      ).then((res) => res.rows[0]);
    },
  };
};
