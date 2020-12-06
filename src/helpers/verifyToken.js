const jwt = require('jsonwebtoken');

module.exports = function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        audience: process.env.AUDIENCE,
        issuer: process.env.ISSUER,
      },
      (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      },
    );
  });
};
