import { Role, User } from '@prisma/client';
import { AuthenticationError, ForbiddenError } from 'apollo-server';

import { ApiContext } from '../../../../types';

type UserResolver = (
  parent: Record<string, never>,
  args: {
    id: number;
  },
  context: ApiContext,
) => Promise<User>;

export default <UserResolver>(
  function user(parent, { id }, { currentUser, prisma }) {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    return prisma.user.findUnique({ where: { id } });
  }
);
