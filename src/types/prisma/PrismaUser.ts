import { Role } from '@prisma/client';

export interface PrismaUser {
  createdAt: Date;
  email: string;
  firstName: string;
  id: number;
  role: Role;
  lastName: string;
  password: string;
}
