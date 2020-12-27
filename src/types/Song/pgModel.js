const getCreateQuery = require('../../helpers/getCreateQuery');
const getUpdateQuery = require('../../helpers/getUpdateQuery');
const withTransaction = require('../../helpers/withTransaction');

module.exports = {
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

  findByUserId(
    user_id,
    {
      limit = 'ALL',
      offset = 0,
      search = '',
      sort = 'name',
      sortDirection = 'asc',
    } = {},
  ) {
    const query = `
      SELECT *
      FROM songs
      WHERE user_id = ${user_id}${search ? ` AND name ILIKE '%${search}%'` : ''}
      ORDER BY ${sort} ${sortDirection.toUpperCase()}
      LIMIT ${limit}
      OFFSET ${offset};
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
