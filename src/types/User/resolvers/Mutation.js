const { ApolloError, ValidationError } = require('apollo-server');
const isEmail = require('isemail');

const model = require('../model');

module.exports = {
  login: async (_, { email }) => {
    if (!isEmail.validate(email)) {
      throw new ValidationError('Email format invalid.');
    }

    const isUser = await model.exists({ email });

    if (!isUser) {
      throw new ApolloError('User with that email not found.', 'NOT_FOUND');
    }

    return {
      success: true,
      token: Buffer.from(email).toString('base64'),
    };
  },

  register: async (_, { email }) => {
    if (!isEmail.validate(email)) {
      throw new ValidationError('Email format invalid.');
    }

    const isExistingUser = await model.exists({ email });

    if (isExistingUser) {
      throw new ValidationError('User with that email already exists.');
    }

    const user = new model({ email });

    await user.save();

    return {
      success: true,
      token: Buffer.from(email).toString('base64'),
    };
  },
};
