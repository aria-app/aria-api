const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} = require('apollo-server');
const isEqual = require('lodash/fp/isEqual');

module.exports = {
  deleteSequence: async (_, { id }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const sequence = await models.Sequence.findOneById(id);
    const track = await models.Track.findOneById(sequence.track_id);
    const song = await models.Song.findOneById(track.song_id);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    await models.Sequence.delete(id);

    return {
      message: 'Sequence was deleted successfully.',
      success: true,
    };
  },

  updateSequence: async (_, { input }, { currentUser, models }) => {
    const { id, measureCount } = input;

    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const sequence = await models.Sequence.findOneById(id);
    const track = await models.Track.findOneById(sequence.track_id);
    const song = await models.Song.findOneById(track.song_id);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    if (
      isEqual(
        {
          measure_count: measureCount,
        },
        {
          measureCount: track.measureCount,
        },
      )
    ) {
      throw new UserInputError('No changes submitted');
    }

    const updatedSequence = await models.Sequence.update(id, {
      measure_count: measureCount,
    });

    return {
      message: 'Sequence was updated successfully.',
      sequence: updatedSequence,
      success: true,
    };
  },
};
