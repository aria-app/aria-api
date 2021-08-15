import { Role, User } from '@prisma/client';
import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { isError } from 'lodash';

import { getPaginatedResponseMetadata } from '../../../../shared';
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
  { container, currentUser },
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

  if (isError(getUsersResult)) {
    throw getUsersResult;
  }

  const getUsersTotalCountResult = await userRepository.getUsersTotalCount({
    search,
  });

  if (isError(getUsersTotalCountResult)) {
    throw getUsersTotalCountResult;
  }

  return {
    data: getUsersResult,
    meta: getPaginatedResponseMetadata({
      limit,
      page,
      totalItemCount: getUsersTotalCountResult,
    }),
  };
};
