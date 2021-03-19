import bcrypt from 'bcrypt';

export default function verifyPassword({
  attemptedPassword,
  hashedPassword,
}: Record<string, string>): boolean {
  return bcrypt.compare(attemptedPassword, hashedPassword);
}
