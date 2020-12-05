const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const verifyToken = async (bearerToken) => {
  const client = jwksClient({
    jwksUri: `${process.env.AUTH_ISSUER}.well-known/jwks.json`,
  });

  return new Promise((resolve, reject) => {
    jwt.verify(
      bearerToken,
      (header, callback) => {
        client.getSigningKey(header.kid, (error, key) => {
          const signingKey = key.publicKey || key.rsaPublicKey;

          callback(null, signingKey);
        });
      },
      {
        algorithms: ['RS256'],
        audience: process.env.AUTH_AUDIENCE,
        issuer: process.env.AUTH_ISSUER,
      },
      (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      },
    );
  });
};

module.exports = verifyToken;
