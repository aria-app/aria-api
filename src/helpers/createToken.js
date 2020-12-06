const jwt = require('jsonwebtoken');

module.exports = function createToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        aud: process.env.AUDIENCE,
        email: payload.email,
        iss: process.env.ISSUER,
        sub: payload._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      },
    );
  });
};
