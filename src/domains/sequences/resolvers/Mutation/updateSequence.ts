import { Sequence } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import isNil from 'lodash/fp/isNil';
import omitBy from 'lodash/fp/omitBy';

import ApiContext from '../../../../models/ApiContext';

interface UpdateSequenceInput {
  id: number;
  measureCount?: number;
  position?: number;
}

interface UpdateSequenceResponse {
  message: string;
  sequence: Sequence;
  success: boolean;
}

type UpdateSequenceResolver = (
  parent: Record<string, never>,
  args: {
    input: UpdateSequenceInput;
  },
  context: ApiContext,
) => Promise<UpdateSequenceResponse>;

export default <UpdateSequenceResolver>(
  async function updateSequence(_, { input }, { currentUser, prisma }) {
    const { id, measureCount, position } = input;

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

    const updatedSequence = await prisma.sequence.update({
      data: omitBy(isNil, {
        measureCount,
        position,
      }),
      include: {
        notes: {
          include: {
            sequence: {
              select: {
                id: true,
              },
            },
          },
        },
        track: true,
      },
      where: {
        id,
      },
    });

    await prisma.song.update({
      data: { updatedAt: new Date() },
      where: { id: song.id },
    });

    return {
      message: 'Sequence was updated successfully.',
      sequence: updatedSequence,
      success: true,
    };
  }
);
