const { AuthenticationError, ForbiddenError } = require('apollo-server');

const Admin = require('../../Admin');
const model = require('../model');

module.exports = {
  me: async (_, __, { currentUser }) => {
    return currentUser;
  },

  users: async (_, __, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isCurrentUserAdmin = !!(await Admin.model.findOneByUserId(
      currentUser.id,
    ));

    if (!isCurrentUserAdmin) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    return model.find();
  },
};
