import { ID, Result, User } from '../../../types';

export const UserRepository = Symbol('UserRepository');
export interface UserRepository {
  getUserById(id: ID): Promise<Result<User>>;
}
