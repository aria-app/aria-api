const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} = require('apollo-server');
const isEqual = require('lodash/fp/isEqual');

module.exports = {
  updateNote: async (_, { input }, { currentUser, models }) => {
    const { id, points } = input;

    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const note = await models.Note.findOneById(id);
    const sequence = await models.Sequence.findOneById(note.sequence_id);
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
          points,
        },
        {
          points: note.points,
        },
      )
    ) {
      throw new UserInputError('No changes submitted');
    }

    const updatedNote = await models.Note.update(id, {
      points: JSON.stringify(points),
    });

    return {
      message: 'Note was updated successfully.',
      note: updatedNote,
      success: true,
    };
  },
};
