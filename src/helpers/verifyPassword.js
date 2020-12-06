const bcrypt = require('bcrypt');

module.exports = function verifyPassword({
  attemptedPassword,
  hashedPassword,
}) {
  return bcrypt.compare(attemptedPassword, hashedPassword);
};
