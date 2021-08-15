import { isNil } from 'lodash';

import { PrismaUser, Result, Role, User } from '../../../types';

export function mapPrismaUserToUserEntity(
  prismaUser: PrismaUser,
): Result<User> {
  if (!prismaUser) {
    return new Error('Prisma user was null or undefined');
  }

  const {
    createdAt,
    email,
    firstName,
    id,
    role,
    lastName,
    password,
  } = prismaUser;

  if (isNil(createdAt)) {
    return new Error('Prisma user createdAt was null or undefined');
  }

  if (isNil(email)) {
    return new Error('Prisma user email was null or undefined');
  }

  if (isNil(firstName)) {
    return new Error('Prisma user firstName was null or undefined');
  }

  if (isNil(id)) {
    return new Error('Prisma user id was null or undefined');
  }

  if (isNil(role)) {
    return new Error('Prisma user role was null or undefined');
  }

  if (isNil(Role[role])) {
    return new Error('Prisma user role was not a valid Role');
  }

  if (isNil(lastName)) {
    return new Error('Prisma user lastName was null or undefined');
  }

  if (isNil(password)) {
    return new Error('Prisma user password was null or undefined');
  }

  return {
    createdAt,
    email,
    firstName,
    id,
    role: Role[role],
    lastName,
    password,
  };
}
