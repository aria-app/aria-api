import { IResolverObject } from 'apollo-server';

import ApiContext from '../../../models/ApiContext';

export default {
  voice: (_, { id }, { prisma }) =>
    prisma.voice.findUnique({ where: { id: parseInt(id, 10) } }),

  voices: (_, __, { prisma }) =>
    prisma.voice.findMany({ orderBy: { name: 'asc' } }),
} as IResolverObject<any, ApiContext>;
