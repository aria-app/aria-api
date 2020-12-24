const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create({ bpm, date_modified, measure_count, name, user_id }) {
    return withTransaction((client) =>
      client.query(
        `
        INSERT INTO songs(bpm, date_modified, measure_count, name, user_id)
        VALUES($1, $2, $3, $4, $5)
        RETURNING id;
      `,
        [bpm, date_modified, measure_count, name, user_id],
      ),
    );
  },

  findAll() {
    return withTransaction((client) => client.query('SELECT * FROM songs;'));
  },
};
