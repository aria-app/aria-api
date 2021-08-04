import { Role, User } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ValidationError,
} from 'apollo-server';
import isEmail from 'isemail';
import isEqual from 'lodash/fp/isEqual';
import isNil from 'lodash/fp/isNil';
import omitBy from 'lodash/fp/omitBy';

import { ApiContext } from '../../../../types';

interface UpdateUserInput {
  email?: string;
  firstName?: string;
  id: number;
  lastName?: string;
}

interface UpdateUserResponse {
  message: string;
  success: boolean;
  user: User;
}

type UpdateUserResolver = (
  parent: Record<string, never>,
  args: {
    input: UpdateUserInput;
  },
  context: ApiContext,
) => Promise<UpdateUserResponse>;

export default <UpdateUserResolver>(
  async function updateUser(parent, { input }, { currentUser, prisma }) {
    const { email, firstName, id, lastName } = input;

    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApolloError('User was not found.');
    }

    if (user.role !== Role.ADMIN && currentUser.id !== user.id) {
      throw new ForbiddenError(
        'Logged in user does not have permission to manage this user.',
      );
    }

    if (
      isEqual(
        {
          email,
          firstName,
          lastName,
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

    if (!isNil(email) && !isEmail.validate(email)) {
      throw new ValidationError('Email format invalid.');
    }

    if (!isNil(email) && email !== user.email) {
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUserWithEmail) {
        throw new ValidationError('User with that email already exists.');
      }
    }

    const updatedUser = await prisma.user.update({
      data: omitBy(isNil, {
        email,
        firstName,
        lastName,
      }),
      where: { id },
    });

    return {
      message: 'User was updated successfully.',
      success: true,
      user: updatedUser,
    };
  }
);
