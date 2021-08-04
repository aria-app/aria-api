import { Role, User } from '@prisma/client';
import { AuthenticationError, ForbiddenError } from 'apollo-server';

import { Resolver } from '../../../../types';

interface UserVariables {
  id: number;
}

export const user: Resolver<User | null, UserVariables> = (
  parent,
  { id },
  { currentUser, prisma },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  if (currentUser.role !== Role.ADMIN) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  return prisma.user.findUnique({ where: { id } });
};
