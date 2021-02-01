const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ValidationError,
} = require('apollo-server');
const isEmail = require('isemail');
const jwtDecode = require('jwt-decode');
const isEqual = require('lodash/fp/isEqual');
const isNil = require('lodash/fp/isNil');
const omitBy = require('lodash/fp/omitBy');

const createToken = require('../../../helpers/createToken');
const hashPassword = require('../../../helpers/hashPassword');
const verifyPassword = require('../../../helpers/verifyPassword');

module.exports = {
  deleteUser: async (_, { id }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const user = await models.User.findOneById(id);

    if (String(currentUser.id) !== String(user.id)) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    await models.User.delete(id);

    return {
      message: 'User was deleted successfully.',
      success: true,
    };
  },

  login: async (_, { email, password }, { models, res }) => {
    if (!isEmail.validate(email)) {
      throw new ValidationError('Email format invalid.');
    }

    const user = await models.User.findOneByEmail(email);

    if (!user) {
      throw new ForbiddenError('Email or password is incorrect.');
    }
    const isPasswordVerified = await verifyPassword({
      attemptedPassword: password,
      hashedPassword: user.password,
    });

    if (!isPasswordVerified) {
      throw new ForbiddenError('Email or password is incorrect.');
    }

    try {
      const userInfo = {
        email: user.email,
        id: user.id,
      };

      const token = await createToken(userInfo);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      res.cookie('token', token, {
        httpOnly: true,
      });

      return {
        expiresAt,
        success: true,
        token,
        user,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);

      throw new ApolloError('Something went wrong.', 'SERVER_ERROR');
    }
  },

  logout: async (_, __, { res }) => {
    res.clearCookie('token');

    return {
      success: true,
    };
  },

  register: async (
    _,
    { email, firstName, lastName, password },
    { models, res },
  ) => {
    const formattedEmail = email.toLowerCase();

    if (!isEmail.validate(formattedEmail)) {
      throw new ValidationError('Email format invalid.');
    }

    const isExistingUserEmail = await models.User.findOneByEmail(
      formattedEmail,
    );

    if (isExistingUserEmail) {
      throw new ValidationError('User with that email already exists.');
    }

    try {
      const hashedPassword = await hashPassword(password);

      const newUser = await models.User.create({
        email: formattedEmail,
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
      });

      const userInfo = {
        id: newUser.id,
        email: newUser.email,
      };

      const token = await createToken(userInfo);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      res.cookie('token', token, {
        httpOnly: true,
      });

      return {
        expiresAt,
        success: true,
        token,
        user: newUser,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);

      throw new ApolloError('Something went wrong.', 'SERVER_ERROR');
    }
  },

  updateUser: async (_, { input }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isCurrentUserAdmin = !!(await models.Admin.findOneByUserId(
      currentUser.id,
    ));

    const user = await models.User.findOneById(input.id);

    if (!isCurrentUserAdmin && currentUser.id !== user.id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    if (
      isEqual(
        {
          email: input.email,
          first_name: input.firstName,
          last_name: input.lastName,
        },
        {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      )
    ) {
      throw new UserInputError('No changes submitted');
    }

    if (!isEmail.validate(input.email)) {
      throw new ValidationError('Email format invalid.');
    }

    if (input.email !== user.email) {
      const isExistingUserEmail = await models.User.findOneByEmail(input.email);

      if (isExistingUserEmail) {
        throw new ValidationError('User with that email already exists.');
      }
    }

    const updatedUser = await models.User.update(
      input.id,
      omitBy(isNil, {
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
      }),
    );

    return {
      message: 'User was updated successfully.',
      success: true,
      user: updatedUser,
    };
  },
};
