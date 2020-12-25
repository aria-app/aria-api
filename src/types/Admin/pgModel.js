const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create({ user_id }) {
    return withTransaction((client) =>
      client.query(
        `
        INSERT INTO admins(user_id)
        VALUES($1)
        RETURNING id;
      `,
        [user_id],
      ),
    );
  },

  findAll() {
    return withTransaction((client) => client.query('SELECT * FROM admins;'));
  },
};
