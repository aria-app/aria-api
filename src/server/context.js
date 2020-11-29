const isEmail = require('isemail');

const User = require('../types/User');

module.exports = async function context({ req }) {
  const authorization = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(authorization, 'base64').toString('ascii');

  if (!isEmail.validate(email)) return { currentUser: null };

  const currentUser = await User.model.findOne({ email });

  return { currentUser };
};
