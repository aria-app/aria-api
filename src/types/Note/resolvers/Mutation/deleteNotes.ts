import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  ValidationError,
} from 'apollo-server';
import isEmpty from 'lodash/fp/isEmpty';

import ApiContext from '../../../../models/ApiContext';

interface DeleteNotesResponse {
  message: string;
  success: boolean;
}

type DeleteNotesResolver = (
  parent: Record<string, never>,
  args: {
    ids: number[];
  },
  context: ApiContext,
) => Promise<DeleteNotesResponse>;

export default <DeleteNotesResolver>(
  async function deleteNotes(_, { ids }, { currentUser, prisma }) {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    if (isEmpty(ids)) {
      throw new ValidationError('Note IDs to delete must be provided.');
    }

    const song = await prisma.note
      .findUnique({ where: { id: ids[0] } })
      .sequence()
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

    await prisma.note.deleteMany({ where: { id: { in: ids } } });

    await prisma.song.update({
      data: { updatedAt: new Date() },
      where: { id: song.id },
    });

    return {
      message: 'Notes were deleted successfully.',
      success: true,
    };
  }
);
