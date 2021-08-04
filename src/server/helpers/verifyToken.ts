import jwt from 'jsonwebtoken';

import { DecodedAuthToken } from '../../types';

export function verifyToken(
  token: string,
): Promise<DecodedAuthToken | undefined> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      {
        audience: process.env.AUDIENCE,
        issuer: process.env.ISSUER,
      },
      (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload as DecodedAuthToken);
        }
      },
    );
  });
}
