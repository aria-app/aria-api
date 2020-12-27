const {
  ApolloError,
  ForbiddenError,
  ValidationError,
} = require('apollo-server');
const isEmail = require('isemail');
const jwtDecode = require('jwt-decode');

const createToken = require('../../../helpers/createToken');
const hashPassword = require('../../../helpers/hashPassword');
const verifyPassword = require('../../../helpers/verifyPassword');
const model = require('../model');

module.exports = {
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

    const isExistingUser = await model.findOneByEmail(formattedEmail);

    if (isExistingUser) {
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
};
