import { Role, User } from '@prisma/client';
import { AuthenticationError, ForbiddenError } from 'apollo-server';

import { Resolver } from '../../../../types';
import { UserRepository } from '../../repositories';

interface UserVariables {
  id: number;
}

export const user: Resolver<User | null, UserVariables> = async (
  _,
  { id },
  { container, currentUser },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  if (currentUser.role !== Role.ADMIN) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  const userRepository = container.get<UserRepository>(UserRepository);

  const userOrError = await userRepository.getUserById(id);

  if (userOrError instanceof Error) {
    throw userOrError;
  }

  return userOrError;
};
