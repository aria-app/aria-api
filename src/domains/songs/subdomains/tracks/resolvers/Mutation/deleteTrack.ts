import { Track } from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';

import { Resolver } from '../../../../../../types';

interface DeleteTrackResponse {
  message: string;
  success: boolean;
  track: Track;
}

interface DeleteTrackVariables {
  id: number;
}

export const deleteTrack: Resolver<
  DeleteTrackResponse,
  DeleteTrackVariables
> = async (_, { id }, { currentUser, prisma }) => {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const trackQuery = prisma.track.findUnique({ where: { id } });

  const track = await trackQuery;

  if (!track) {
    throw new ApolloError('Could not find track.');
  }

  const song = await trackQuery.song();

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
    track,
  };
};
