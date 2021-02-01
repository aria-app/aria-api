const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} = require('apollo-server');
const isEqual = require('lodash/fp/isEqual');
const isNil = require('lodash/fp/isNil');
const omitBy = require('lodash/fp/omitBy');

module.exports = {
  deleteTrack: async (_, { id }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const track = await models.Track.findOneById(id);
    const song = await models.Song.findOneById(track.song_id);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    await models.Track.delete(id);

    return {
      message: 'Track was deleted successfully.',
      success: true,
    };
  },

  updateTrack: async (_, { input }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const track = await models.Track.findOneById(input.id);
    const song = await models.Song.findOneById(track.song_id);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    if (
      isEqual(
        {
          voice_id: input.voiceId,
          volume: input.volume,
        },
        {
          voice_id: track.voice_id,
          volume: track.volume,
        },
      )
    ) {
      throw new UserInputError('No changes submitted');
    }

    const updatedTrack = await models.Track.update(
      input.id,
      omitBy(isNil, {
        voice_id: input.voiceId,
        volume: input.volume,
      }),
    );

    return {
      message: 'Track was updated successfully.',
      track: updatedTrack,
      success: true,
    };
  },
};
