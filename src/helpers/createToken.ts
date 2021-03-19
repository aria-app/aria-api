import jwt from 'jsonwebtoken';

export default function createToken(
  payload: Record<string, number | string>,
): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        aud: process.env.AUDIENCE,
        email: payload.email,
        iss: process.env.ISSUER,
        sub: payload.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
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
}
