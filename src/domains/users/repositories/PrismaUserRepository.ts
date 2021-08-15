import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { isError, isNumber, isString } from 'lodash';

import { ID, Result, User } from '../../../types';
import { mapPrismaUserToUserEntity } from '../mappers';
import {
  GetUsersOptions,
  GetUsersTotalCountOptions,
  UserRepository,
} from './UserRepository';

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
    page = 1,
    search,
    sort,
    sortDirection,
  }: GetUsersOptions): Promise<Result<User[]>> {
    try {
      const where = getUserWhereInput(search);
      const orderBy = sort ? { [sort]: sortDirection } : undefined;
      const skip =
        isNumber(limit) && isNumber(page) ? (page - 1) * limit : undefined;
      const take = isNumber(limit) ? limit : undefined;

      const prismaUsers = await this.prismaClient.user.findMany({
        orderBy,
        skip,
        take,
        where,
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

  public async getUsersTotalCount({
    search,
  }: GetUsersTotalCountOptions): Promise<Result<number>> {
    try {
      const where = getUserWhereInput(search);

      return this.prismaClient.user.count({ where });
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
