const { AuthenticationError, ForbiddenError } = require('apollo-server');

const Admin = require('../../Admin');
const model = require('../model');

module.exports = {
  me: async (_, __, { currentUser }) => {
    return currentUser;
  },

  user: async (_, { id }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isCurrentUserAdmin = !!(await Admin.model.findOneByUserId(
      currentUser.id,
    ));

    if (!isCurrentUserAdmin) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    return model.findOneById(id);
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
    { currentUser },
  ) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isCurrentUserAdmin = !!(await Admin.model.findOneByUserId(
      currentUser.id,
    ));

    if (!isCurrentUserAdmin) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    const allUsers = await model.find({
      search,
      sort,
      sortDirection,
    });

    const usersPage = await model.find({
      limit,
      offset: page - 1,
      search,
      sort,
      sortDirection,
    });

    return {
      data: usersPage,
      meta: {
        currentPage: page,
        itemsPerPage: limit === 'ALL' ? allUsers.length : limit,
        totalItemCount: allUsers.length,
      },
    };
  },
};
