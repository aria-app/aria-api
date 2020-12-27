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

const createToken = require('../../../helpers/createToken');
const hashPassword = require('../../../helpers/hashPassword');
const verifyPassword = require('../../../helpers/verifyPassword');
const Admin = require('../../Admin');
const model = require('../model');

module.exports = {
  deleteUser: async (_, { id }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const user = await model.findOneById(id);

    if (String(currentUser.id) !== String(user.id)) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    await model.delete(id);

    return {
      message: 'User was deleted successfully.',
      success: true,
    };
  },

  login: async (_, { email, password }, { res }) => {
    if (!isEmail.validate(email)) {
      throw new ValidationError('Email format invalid.');
    }

    const user = await model.findOneByEmail(email);

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

  register: async (_, { email, firstName, lastName, password }, { res }) => {
    const formattedEmail = email.toLowerCase();

    if (!isEmail.validate(formattedEmail)) {
      throw new ValidationError('Email format invalid.');
    }

    const isExistingUserEmail = await model.findOneByEmail(formattedEmail);

    if (isExistingUserEmail) {
      throw new ValidationError('User with that email already exists.');
    }

    try {
      const hashedPassword = await hashPassword(password);

      const newUser = await model.create({
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

  updateUser: async (_, { id, updates }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isCurrentUserAdmin = !!(await Admin.model.findOneByUserId(
      currentUser.id,
    ));

    const user = await model.findOneById(id);

    if (!isCurrentUserAdmin && currentUser.id !== user.id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    if (
      isEqual(
        {
          email: updates.email,
          first_name: updates.firstName,
          last_name: updates.lastName,
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

    if (!isEmail.validate(updates.email)) {
      throw new ValidationError('Email format invalid.');
    }

    if (updates.email !== user.email) {
      const isExistingUserEmail = await model.findOneByEmail(updates.email);

      if (isExistingUserEmail) {
        throw new ValidationError('User with that email already exists.');
      }
    }

    const updatedUser = await model.update(id, {
      email: updates.email,
      first_name: updates.firstName,
      last_name: updates.lastName,
    });

    return {
      message: 'User was updated successfully.',
      success: true,
      user: updatedUser,
    };
  },
};
