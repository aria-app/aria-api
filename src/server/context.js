const verifyToken = require('../helpers/verifyToken');

const User = require('../types/User');

module.exports = async function context({ req, ...rest }) {
  let isAuthenticated = false;
  let currentUser = null;
  try {
    const authHeader = req.headers.authorization || '';

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const payload = await verifyToken(token);
      isAuthenticated = !!(payload && payload.sub);
      currentUser = payload && (await User.model.findById(payload.sub));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return { ...rest, req, currentUser, isAuthenticated };
};
