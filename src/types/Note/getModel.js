const getCreateQuery = require('../../helpers/getCreateQuery');
const getDeleteManyQuery = require('../../helpers/getDeleteManyQuery');
const getFindManyQuery = require('../../helpers/getFindManyQuery');
const getUpdateQuery = require('../../helpers/getUpdateQuery');

module.exports = function getModel({ withTransaction }) {
  return {
    create(values) {
      return withTransaction((client) =>
        client.query(getCreateQuery('notes', values), Object.values(values)),
      ).then((res) => res.rows[0]);
    },

    deleteMany(ids) {
      return withTransaction((client) =>
        client.query(getDeleteManyQuery('notes', ids), ids),
      ).then((res) => res.rows);
    },

    findBySequenceId(sequence_id) {
      const query = `SELECT * FROM notes WHERE sequence_id = ${sequence_id};`;
      return withTransaction((client) => client.query(query)).then(
        (res) => res.rows,
      );
    },

    findOneById(id) {
      const query = `SELECT * FROM notes WHERE id = ${id} LIMIT 1;`;
      return withTransaction((client) => client.query(query)).then(
        (res) => res.rows[0],
      );
    },

    findMany(ids) {
      return withTransaction((client) =>
        client.query(getFindManyQuery('notes', ids), ids),
      ).then((res) => res.rows);
    },

    updateMany(updateSets) {
      return withTransaction((client) => {
        return Promise.all(
          updateSets.map((updateSet) =>
            client
              .query(
                getUpdateQuery('notes', updateSet.id, updateSet.updates),
                Object.values(updateSet.updates),
              )
              .then((res) => res.rows[0]),
          ),
        );
      });
    },
  };
};
