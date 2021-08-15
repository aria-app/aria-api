import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { ID, Result, User } from '../../../types';
import { mapPrismaUserToUserEntity } from '../mappers';
import { UserRepository } from './UserRepository';

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
}
