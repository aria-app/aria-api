import { Sequence } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';

import ApiContext from '../../../../models/ApiContext';

interface DeleteSequenceResponse {
  message: string;
  sequence: Sequence;
  success: boolean;
}

type DeleteSequenceResolver = (
  parent: Record<string, never>,
  args: {
    id: number;
  },
  context: ApiContext,
) => Promise<DeleteSequenceResponse>;

export default <DeleteSequenceResolver>(
  async function deleteSequence(_, { id }, { currentUser, prisma }) {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await prisma.sequence
      .findUnique({ where: { id } })
      .track()
      .song();

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
      success: true,
    };
  }
);
