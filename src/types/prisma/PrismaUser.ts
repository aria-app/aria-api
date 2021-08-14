import { Role } from '../domain/Role';

export interface PrismaUser {
  createdAt: Date;
  email: string;
  firstName: string;
  id: number;
  role: Role;
  lastName: string;
  password: string;
}
