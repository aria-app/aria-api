const snakeCase = require('lodash/fp/snakeCase');
const getCreateQuery = require('../../helpers/getCreateQuery');
const getUpdateQuery = require('../../helpers/getUpdateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  count({ search = '', userId } = {}) {
    const query = `
      SELECT COUNT(*)
      FROM songs
      ${
        userId
          ? `WHERE user_id = ${userId}${
              search ? ` AND name ILIKE '%${search}%'` : ''
            }`
          : `${search ? `WHERE name ILIKE '%${search}%'` : ''}`
      };
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0].count,
    );
  },

  create(values) {
    return withTransaction((client) =>
      client.query(getCreateQuery('songs', values), Object.values(values)),
    ).then((res) => res.rows[0]);
  },

  delete(id) {
    const query = `
      DELETE FROM songs
      WHERE id = ${id};
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0],
    );
  },

  findOneById(id) {
    const query = `
      SELECT *
      FROM songs
      WHERE id = ${id}
      LIMIT 1;
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows[0],
    );
  },

  find({
    limit = 'ALL',
    offset = 0,
    search = '',
    sort = 'name',
    sortDirection = 'asc',
    userId,
  } = {}) {
    const query = `
      SELECT *
      FROM songs
      ${
        userId
          ? `WHERE user_id = ${userId}${
              search ? ` AND name ILIKE '%${search}%'` : ''
            }`
          : `${search ? `WHERE name ILIKE '%${search}%'` : ''}`
      }
      ORDER BY ${snakeCase(sort)} ${sortDirection.toUpperCase()}
      LIMIT ${limit}
      OFFSET ${limit === 'ALL' ? 0 : offset * limit};
    `;
    return withTransaction((client) => client.query(query)).then(
      (res) => res.rows,
    );
  },

  update(id, updates) {
    return withTransaction((client) =>
      client.query(
        getUpdateQuery('songs', id, updates),
        Object.values(updates),
      ),
    ).then((res) => res.rows[0]);
  },
};
