import { Role, User } from '@prisma/client';
import { AuthenticationError, ForbiddenError } from 'apollo-server';
import isNil from 'lodash/fp/isNil';

import { PaginatedResponse, Resolver } from '../../../../types';

interface UsersVariables {
  limit?: number;
  page: number;
  search: string;
  sort: string;
  sortDirection: string;
}

export const users: Resolver<PaginatedResponse<User>, UsersVariables> = async (
  parent,
  { limit, page = 1, search = '', sort = 'firstName', sortDirection = 'asc' },
  { currentUser, prisma },
) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  if (currentUser.role !== Role.ADMIN) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  const usersPage = await prisma.user.findMany({
    ...(!isNil(limit)
      ? {
          skip: (page - 1) * limit,
          take: limit,
        }
      : {}),
    where: {
      OR: [
        {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    },
    orderBy: {
      [sort]: sortDirection,
    },
  });

  const totalItemCount = await prisma.user.count({
    where: {
      OR: [
        {
          firstName: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          lastName: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
      ],
    },
  });

  return {
    data: usersPage,
    meta: {
      currentPage: page,
      itemsPerPage: isNil(limit) ? totalItemCount : limit,
      totalItemCount,
    },
  };
};
