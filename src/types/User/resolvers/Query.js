const { AuthenticationError, ForbiddenError } = require('apollo-server');
const map = require('lodash/fp/map');

const Admin = require('../../Admin');
const model = require('../model');

module.exports = {
  me: async (_, __, { currentUser }) => {
    if (!currentUser) {
      return null;
    }

    const isAdmin = await Admin.model.exists({ userId: currentUser._id });

    return {
      ...currentUser.toObject(),
      isAdmin,
    };
  },

  users: async (_, __, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isCurrentUserAdmin = await Admin.model.exists({
      userId: currentUser._id,
    });

    if (!isCurrentUserAdmin) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    const users = await model.find({}).sort({ firstName: 'asc', email: 'asc' });

    return map(async (user) => {
      const isAdmin = await Admin.model.exists({ userId: user._id });

      return {
        ...user.toObject(),
        isAdmin,
      };
    }, users);
  },
};
