const withTransaction = require('../../helpers/withTransaction');

module.exports = {
  create({ email, first_name, last_name, password }) {
    return withTransaction((client) =>
      client.query(
        `
        INSERT INTO users(email, first_name, last_name, password)
        VALUES($1, $2, $3, $4)
        RETURNING id;
      `,
        [email, first_name, last_name, password],
      ),
    );
  },

  findAll() {
    return withTransaction((client) => client.query('SELECT * FROM users;'));
  },
};
