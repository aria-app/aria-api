import { Role, User } from '@prisma/client';
import { AuthenticationError, ForbiddenError } from 'apollo-server';
import isNil from 'lodash/fp/isNil';

import { PaginatedResponse, Resolver } from '../../../../types';
import { UserRepository } from '../../repositories';

interface UsersVariables {
  limit?: number;
  page: number;
  search: string;
  sort: string;
  sortDirection: string;
}

export const users: Resolver<PaginatedResponse<User>, UsersVariables> = async (
  _,
  { limit, page, search, sort, sortDirection },
  { container, currentUser, prisma },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  if (currentUser.role !== Role.ADMIN) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  const userRepository = container.get<UserRepository>(UserRepository);

  const getUsersResult = await userRepository.getUsers({
    limit,
    page,
    search,
    sort,
    sortDirection,
  });

  if (getUsersResult instanceof Error) {
    throw getUsersResult;
  }

  const totalItemCount = await prisma.user.count({
    where: {
      OR: [
        {
          firstName: {
            contains: search || '',
            mode: 'insensitive' as const,
          },
        },
        {
          lastName: {
            contains: search || '',
            mode: 'insensitive' as const,
          },
        },
      ],
    },
  });

  return {
    data: getUsersResult,
    meta: {
      currentPage: page || 1,
      itemsPerPage: isNil(limit) ? totalItemCount : limit,
      totalItemCount,
    },
  };
};
