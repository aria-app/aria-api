import { Role } from './Role';

export interface User {
  createdAt: Date;
  email: string;
  firstName: string;
  id: number;
  role: Role;
  lastName: string;
  password: string;
}
