const { AuthenticationError, ForbiddenError } = require('apollo-server');

module.exports = {
  me: async (_, __, { currentUser }) => {
    return currentUser;
  },

  user: async (_, { id }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isCurrentUserAdmin = !!(await models.Admin.findOneByUserId(
      currentUser.id,
    ));

    if (!isCurrentUserAdmin) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    return models.User.findOneById(id);
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
    { currentUser, models },
  ) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isCurrentUserAdmin = !!(await models.Admin.findOneByUserId(
      currentUser.id,
    ));

    if (!isCurrentUserAdmin) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    const usersPage = await models.User.find({
      limit,
      offset: page - 1,
      search,
      sort,
      sortDirection,
    });

    const totalItemCount = await models.User.count({
      search,
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
