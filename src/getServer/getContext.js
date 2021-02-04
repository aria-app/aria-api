const cookie = require('cookie');
const verifyToken = require('../helpers/verifyToken');

module.exports = function getContext({ models, skipAuth }) {
  return async ({ req, ...rest }) => {
    if (skipAuth) {
      return {
        ...rest,
        req,
        currentUser: {
          date_created: '2021-02-04 16:44:50.667491',
          email: 'admin@ariaapp.io',
          first_name: 'Alexander',
          id: 1,
          last_name: 'Admin',
        },
        isAuthenticated: true,
        models,
      };
    }
    let isAuthenticated = false;
    let currentUser = null;
    try {
      const cookies = req.headers.cookie
        ? cookie.parse(req.headers.cookie)
        : {};
      const authHeader =
        req.headers && req.headers.authorization
          ? req.headers.authorization.slice(7)
          : '';
      const token = cookies.token || authHeader || '';

      if (token) {
        const payload = await verifyToken(token);
        isAuthenticated = !!(payload && payload.sub);
        currentUser =
          payload &&
          payload.sub &&
          (await models.User.findOneById(payload.sub));
      }
    } catch (error) {
      if (!['jwt expired'].includes(error.message)) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    return { ...rest, req, currentUser, isAuthenticated, models };
  };
};
