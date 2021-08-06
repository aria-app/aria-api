import { User } from '@prisma/client';

import { Resolver } from '../../../../types';

export const currentUser: Resolver<User | null> = async (
  parent,
  args,
  context,
) => context.currentUser;
