const { AuthenticationError, ForbiddenError } = require('apollo-server');
const isNil = require('lodash/fp/isNil');

module.exports = {
  me: async (_, __, { currentUser }) => {
    return currentUser;
  },

  user: async (_, { id }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    return prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
  },

  users: async (
    _,
    {
      limit = 'ALL',
      page = 1,
      search = '',
      sort = 'firstName',
      sortDirection = 'asc',
    },
    { currentUser, prisma },
  ) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    const filters = search
      ? {
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
        }
      : {};

    const usersPage = await prisma.user.findMany({
      ...(!isNil(limit)
        ? {
            skip: (page - 1) * limit,
            take: limit,
          }
        : {}),
      ...filters,
      orderBy: {
        [sort]: sortDirection,
      },
    });

    const totalItemCount = await prisma.user.count({
      ...filters,
    });

    return {
      data: usersPage,
      meta: {
        currentPage: page,
        itemsPerPage: limit === 'ALL' ? totalItemCount : limit,
        totalItemCount,
      },
    };
  },
};
