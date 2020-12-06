const bcrypt = require('bcrypt');

module.exports = function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (saltErr, salt) => {
      if (saltErr) {
        reject(saltErr);
      }

      bcrypt.hash(password, salt, (hashErr, hash) => {
        if (hashErr) {
          reject(hashErr);
        }

        resolve(hash);
      });
    });
  });
};
