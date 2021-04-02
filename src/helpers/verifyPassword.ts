import bcrypt from 'bcrypt';

export default function verifyPassword({
  attemptedPassword,
  hashedPassword,
}: Record<string, string>): Promise<boolean> {
  return bcrypt.compare(attemptedPassword, hashedPassword);
}
