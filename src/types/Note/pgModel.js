const getCreateQuery = require('../../helpers/getCreateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create(values) {
    return withTransaction((client) =>
      client.query(getCreateQuery('notes', values), Object.values(values)),
    ).then((res) => res.rows[0]);
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
};
