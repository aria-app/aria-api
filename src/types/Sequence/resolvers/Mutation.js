const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} = require('apollo-server');
const isEqual = require('lodash/fp/isEqual');
const isNil = require('lodash/fp/isNil');
const omitBy = require('lodash/fp/omitBy');

module.exports = {
  createSequence: async (_, { input }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const track = await models.Track.findOneById(input.trackId);
    const song = await models.Song.findOneById(track.song_id);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    const newSequence = await models.Sequence.create({
      measure_count: 1,
      position: input.position,
      track_id: input.trackId,
    });

    return {
      message: 'Sequence was created successfully.',
      sequence: newSequence,
      success: true,
    };
  },

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

  duplicateSequence: async (_, { id }, { currentUser, models }) => {
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

    const sequenceNotes = await models.Note.findBySequenceId(id);

    const newSequence = await models.Sequence.create({
      measure_count: sequence.measure_count,
      position: sequence.position,
      track_id: sequence.track_id,
    });

    await Promise.all(
      sequenceNotes.map((note) =>
        models.Note.create({
          points: JSON.stringify(note.points),
          sequence_id: newSequence.id,
        }),
      ),
    );

    return {
      message: 'Sequence was duplicated successfully.',
      sequence: newSequence,
      success: true,
    };
  },

  updateSequence: async (_, { input }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const sequence = await models.Sequence.findOneById(input.id);
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
          measure_count: input.measureCount,
          position: input.position,
        },
        {
          measureCount: sequence.measureCount,
          position: sequence.position,
        },
      )
    ) {
      throw new UserInputError('No changes submitted');
    }

    const updatedSequence = await models.Sequence.update(
      input.id,
      omitBy(isNil, {
        measure_count: input.measureCount,
        position: input.position,
      }),
    );

    return {
      message: 'Sequence was updated successfully.',
      sequence: updatedSequence,
      success: true,
    };
  },
};
