import { User } from '@prisma/client';
import { ApolloError, ValidationError } from 'apollo-server';
import isEmail from 'isemail';
import jwtDecode from 'jwt-decode';

import { DecodedAuthToken, Resolver } from '../../../../types';
import { createToken, hashPassword } from '../../helpers';

interface RegisterResponse {
  expiresAt: string;
  success: boolean;
  token: string;
  user: User;
}

interface RegisterVariables {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const register: Resolver<RegisterResponse, RegisterVariables> = async (
  parent,
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
    const decodedToken = jwtDecode<DecodedAuthToken>(token);
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
};
