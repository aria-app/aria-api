const snakeCase = require('lodash/fp/snakeCase');
const getCreateQuery = require('../../helpers/getCreateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create(values) {
    return withTransaction((client) =>
      client.query(getCreateQuery('users', values), Object.values(values)),
    ).then((res) => res.rows[0]);
  },

  find({
    limit = 'ALL',
    offset = 0,
    search = '',
    sort = 'first_name',
    sortDirection = 'asc',
  } = {}) {
    const query = `
      SELECT *
      FROM users
      ${
        search
          ? `WHERE first_name ILIKE '%${search}%' OR last_name ILIKE '%${search}%'`
          : ''
      }
      ORDER BY ${snakeCase(sort)} ${sortDirection.toUpperCase()}
      LIMIT ${limit}
      OFFSET ${limit === 'ALL' ? 0 : offset * limit};
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows,
    );
  },

  findOneByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE email = '${email}'
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
