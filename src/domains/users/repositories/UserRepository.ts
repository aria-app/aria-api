import { ID, Result, User } from '../../../types';

export interface GetUsersOptions {
  limit?: number;
  page: number;
  search: string;
  sort: string;
  sortDirection: string;
}

export interface GetUsersTotalCountOptions {
  search: string;
}

export const UserRepository = Symbol('UserRepository');
export interface UserRepository {
  getUserById(id: ID): Promise<Result<User>>;
  getUsers(getUsersOptions: GetUsersOptions): Promise<Result<User[]>>;
  getUsersTotalCount(
    getUsersTotalCountOptions: GetUsersTotalCountOptions,
  ): Promise<Result<number>>;
}
