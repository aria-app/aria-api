import { User } from '@prisma/client';
import { ApolloError, ForbiddenError, ValidationError } from 'apollo-server';
import isEmail from 'isemail';
import jwtDecode from 'jwt-decode';

import { ApiContext, DecodedAuthToken } from '../../../../types';
import { createToken, verifyPassword } from '../../helpers';

interface LoginResponse {
  expiresAt: string;
  success: boolean;
  token: string;
  user: User;
}

type LoginResolver = (
  parent: Record<string, never>,
  args: {
    email: string;
    password: string;
  },
  context: ApiContext,
) => Promise<LoginResponse>;

export default <LoginResolver>(
  async function login(parent, { email, password }, { res, prisma }) {
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
      const decodedToken = jwtDecode<DecodedAuthToken>(token);
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
  }
);
