const getCreateQuery = require('../../helpers/getCreateQuery');

module.exports = function getModel({ withTransaction }) {
  return {
    create(values) {
      return withTransaction((client) =>
        client.query(getCreateQuery('admins', values), Object.values(values)),
      ).then((res) => res.rows[0]);
    },

    findOneByUserId(user_id) {
      const query = `
      SELECT *
      FROM admins
      WHERE user_id = ${user_id}
      LIMIT 1;
    `;
      return withTransaction((client) => client.query(query)).then(
        (res) => res.rows[0],
      );
    },
  };
};
