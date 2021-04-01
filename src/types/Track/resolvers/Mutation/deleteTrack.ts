import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';

import ApiContext from '../../../../models/ApiContext';

interface DeleteTrackResponse {
  message: string;
  success: boolean;
}

type DeleteTrackResolver = (
  parent: Record<string, never>,
  args: {
    id: number;
  },
  context: ApiContext,
) => Promise<DeleteTrackResponse>;

export default <DeleteTrackResolver>(
  async function deleteTrack(_, { id }, { currentUser, prisma }) {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const track = await prisma.track.findUnique({
      where: {
        id,
      },
    });

    if (!track) {
      throw new ApolloError('Could not find track.');
    }

    const song = await prisma.track
      .findUnique({
        where: {
          id,
        },
      })
      .song();

    if (!song) {
      throw new ApolloError('Could not find corresponding song.');
    }

    if (currentUser.id !== song.userId) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    await prisma.track.delete({
      where: {
        id,
      },
    });

    await prisma.song.update({
      data: { updatedAt: new Date() },
      where: { id: song.id },
    });

    return {
      message: 'Track was deleted successfully.',
      success: true,
    };
  }
);
