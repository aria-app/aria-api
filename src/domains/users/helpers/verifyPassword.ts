import bcrypt from 'bcrypt';

export function verifyPassword({
  attemptedPassword,
  hashedPassword,
}: Record<string, string>): Promise<boolean> {
  return bcrypt.compare(attemptedPassword, hashedPassword);
}
