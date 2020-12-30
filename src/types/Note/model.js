const getCreateQuery = require('../../helpers/getCreateQuery');
const getUpdateQuery = require('../../helpers/getUpdateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create(values) {
    return withTransaction((client) =>
      client.query(getCreateQuery('notes', values), Object.values(values)),
    ).then((res) => res.rows[0]);
  },

  delete(id) {
    const query = `
      DELETE FROM notes
      WHERE id = ${id};
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0],
    );
  },

  findBySequenceId(sequence_id) {
    const query = `
      SELECT *
      FROM notes
      WHERE sequence_id = ${sequence_id};
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows,
    );
  },

  findOneById(id) {
    const query = `
      SELECT *
      FROM notes
      WHERE id = ${id}
      LIMIT 1;
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0],
    );
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
