import jwt from 'jsonwebtoken';

export default function verifyToken(
  token: string,
): Promise<Record<string, any>> {
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
}
