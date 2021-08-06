import { Sequence } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';

import { Resolver } from '../../../../types';

interface DeleteSequenceResponse {
  message: string;
  sequence: Sequence;
  success: boolean;
}

interface DeleteSequenceVariables {
  id: number;
}

export const deleteSequence: Resolver<
  DeleteSequenceResponse,
  DeleteSequenceVariables
> = async (_, { id }, { currentUser, prisma }) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const sequenceQuery = prisma.sequence.findUnique({ where: { id } });

  const sequence = await sequenceQuery;

  if (!sequence) {
    throw new ApolloError('Could not find sequence.', '404');
  }

  const song = await sequenceQuery.track().song();

  if (!song) {
    throw new ApolloError('Could not find corresponding song.');
  }

  if (currentUser.id !== song.userId) {
    throw new ForbiddenError(
      'Logged in user does not have permission to edit this song.',
    );
  }

  await prisma.sequence.delete({ where: { id } });

  return {
    message: 'Sequence was deleted successfully.',
    sequence,
    success: true,
  };
};
