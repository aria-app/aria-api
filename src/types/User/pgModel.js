const getCreateQuery = require('../../helpers/getCreateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create(values) {
    return withTransaction((client) =>
      client.query(getCreateQuery('users', values), Object.values(values)),
    ).then((res) => res.rows[0]);
  },

  find({ limit = 'ALL', offset = 0 }) {
    const query = `
      SELECT *
      FROM users
      LIMIT ${limit}
      OFFSET ${offset};
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows,
    );
  },

  findOneByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0],
    );
  },

  findOneById(id) {
    const query = `
      SELECT *
      FROM users
      WHERE id = ${id}
      LIMIT 1;
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0],
    );
  },
};
