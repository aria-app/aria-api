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
  login: async (_, { email, password }, { res, prisma }) => {
    if (!isEmail.validate(email)) {
      throw new ValidationError('Email format invalid.');
    }

    const user = await prisma.user.findUnique({ where: { email } });

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
    { res, prisma },
  ) => {
    const formattedEmail = email.toLowerCase();

    if (!isEmail.validate(formattedEmail)) {
      throw new ValidationError('Email format invalid.');
    }

    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserWithEmail) {
      throw new ValidationError('User with that email already exists.');
    }

    try {
      const hashedPassword = await hashPassword(password);

      const newUser = await prisma.user.create({
        data: {
          email: formattedEmail,
          firstName,
          lastName,
          password: hashedPassword,
        },
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

  updateUser: async (_, { input }, { currentUser, prisma }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(input.id, 10) },
    });

    if (user.role !== 'ADMIN' && currentUser.id !== user.id) {
      throw new ForbiddenError(
        'Logged in user does not have permission to manage this user.',
      );
    }

    if (
      isEqual(
        {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
        },
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      )
    ) {
      throw new UserInputError('No changes submitted');
    }

    if (!isNil(input.email) && !isEmail.validate(input.email)) {
      throw new ValidationError('Email format invalid.');
    }

    if (!isNil(input.email) && input.email !== user.email) {
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUserWithEmail) {
        throw new ValidationError('User with that email already exists.');
      }
    }

    const updatedUser = await prisma.user.update({
      data: omitBy(isNil, {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
      }),
      where: { id: parseInt(input.id, 10) },
    });

    return {
      message: 'User was updated successfully.',
      success: true,
      user: updatedUser,
    };
  },
};
