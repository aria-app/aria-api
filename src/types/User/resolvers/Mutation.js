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
const Admin = require('../../Admin');
const model = require('../model');

module.exports = {
  login: async (_, { email, password }, { res }) => {
    if (!isEmail.validate(email)) {
      throw new ValidationError('Email format invalid.');
    }

    const user = await model.findOne({ email }).lean();

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
      const isAdmin = await Admin.model.exists({ userId: user._id });

      const userInfo = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        isAdmin,
        lastName: user.lastName,
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
        user: userInfo,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);

      throw new ApolloError('Something went wrong.', 'SERVER_ERROR');
    }
  },

  register: async (_, { email, firstName, lastName, password }, { res }) => {
    const formattedEmail = email.toLowerCase();

    if (!isEmail.validate(formattedEmail)) {
      throw new ValidationError('Email format invalid.');
    }

    const isExistingUser = await model.exists({ email: formattedEmail });

    if (isExistingUser) {
      throw new ValidationError('User with that email already exists.');
    }

    try {
      const hashedPassword = await hashPassword(password);

      const newUser = new model({
        email: formattedEmail,
        firstName,
        lastName,
        password: hashedPassword,
      });

      await newUser.save();

      const userInfo = {
        _id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        isAdmin: false,
        lastName: newUser.lastName,
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
        user: userInfo,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);

      throw new ApolloError('Something went wrong.', 'SERVER_ERROR');
    }
  },
};
