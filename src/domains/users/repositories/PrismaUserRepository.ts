import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { isError, isString } from 'lodash';

import { getOrderBy, getSkip, getTake } from '../../../shared';
import { ID, Result, User } from '../../../types';
import { mapPrismaUserToUserEntity } from '../mappers';
import { GetUsersOptions, UserRepository } from './UserRepository';

@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(@inject('PrismaClient') private prismaClient: PrismaClient) {}

  public async getUserById(id: ID): Promise<Result<User>> {
    const prismaUser = await this.prismaClient.user.findUnique({
      where: { id },
    });

    if (!prismaUser) {
      return new Error('User not found');
    }

    return mapPrismaUserToUserEntity(prismaUser);
  }

  public async getUsers({
    limit,
    page,
    search,
    sort,
    sortDirection,
  }: GetUsersOptions): Promise<Result<User[]>> {
    try {
      const prismaUsers = await this.prismaClient.user.findMany({
        orderBy: getOrderBy(sort, sortDirection),
        skip: getSkip(limit, page),
        take: getTake(limit),
        where: getUserWhereInput(search),
      });

      const usersMapResults = prismaUsers.map(mapPrismaUserToUserEntity);
      const mappedUserError = usersMapResults.find((usersMapResult) =>
        isError(usersMapResult),
      );

      if (isError(mappedUserError)) {
        return mappedUserError;
      }

      return usersMapResults as User[];
    } catch (error) {
      return error;
    }
  }

  public async getUsersCount({
    search,
  }: GetUsersOptions): Promise<Result<number>> {
    try {
      return this.prismaClient.user.count({ where: getUserWhereInput(search) });
    } catch (error) {
      return error;
    }
  }
}

function getUserWhereInput(search?: string): Prisma.UserWhereInput | undefined {
  return isString(search)
    ? {
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
      }
    : undefined;
}
