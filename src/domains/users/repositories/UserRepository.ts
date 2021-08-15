import { ID, Result, User } from '../../../types';

export interface GetUsersOptions {
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  sortDirection?: string;
}

export const UserRepository = Symbol('UserRepository');
export interface UserRepository {
  getUserById(id: ID): Promise<Result<User>>;
  getUsers(options: GetUsersOptions): Promise<Result<User[]>>;
  getUsersCount(options: GetUsersOptions): Promise<Result<number>>;
}
