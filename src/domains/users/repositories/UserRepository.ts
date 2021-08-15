import { ID, Result, User } from '../../../types';

export interface UsersQueryOptions {
  limit?: number;
  page: number;
  search: string;
  sort: string;
  sortDirection: string;
}

export const UserRepository = Symbol('UserRepository');
export interface UserRepository {
  getUserById(id: ID): Promise<Result<User>>;
  getUsers(usersQueryOptions: UsersQueryOptions): Promise<Result<User[]>>;
}
