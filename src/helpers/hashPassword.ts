import bcrypt from 'bcrypt';

export default function hashPassword(password: string): Promise<string> {
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
}
