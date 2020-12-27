const { AuthenticationError, ForbiddenError } = require('apollo-server');

const Admin = require('../../Admin');
const pgModel = require('../pgModel');

module.exports = {
  me: async (_, __, { currentUser }) => {
    return currentUser;
  },

  users: async (_, __, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isCurrentUserAdmin = !!(await Admin.pgModel.findOneByUserId(
      currentUser.id,
    ));

    if (!isCurrentUserAdmin) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    return pgModel.find();
  },
};
