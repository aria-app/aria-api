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

import ApiContext from '../../../../models/ApiContext';

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
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const user = await prisma.user.findUnique({
      where: { id: input.id },
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
      where: { id: input.id },
    });

    return {
      message: 'User was updated successfully.',
      success: true,
      user: updatedUser,
    };
  }
);
