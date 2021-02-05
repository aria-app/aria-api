const { AuthenticationError, ForbiddenError } = require('apollo-server');

module.exports = {
  createNote: async (_, { input }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const sequence = await models.Sequence.findOneById(input.sequenceId);
    const track = await models.Track.findOneById(sequence.track_id);
    const song = await models.Song.findOneById(track.song_id);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    const newNote = await models.Note.create({
      points: JSON.stringify(input.points),
      sequence_id: input.sequenceId,
    });

    return {
      message: 'Note was created successfully.',
      note: newNote,
      success: true,
    };
  },

  deleteNotes: async (_, { ids }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const note = await models.Note.findOneById(ids[0]);
    const sequence = await models.Sequence.findOneById(note.sequence_id);
    const track = await models.Track.findOneById(sequence.track_id);
    const song = await models.Song.findOneById(track.song_id);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'Logged in user does not have permission to edit this song.',
      );
    }

    await models.Note.deleteMany(ids);

    return {
      message: 'Notes were deleted successfully.',
      success: true,
    };
  },

  updateNotesPoints: async (_, { input }, { currentUser, models }) => {
    const { notes } = input;

    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    notes.forEach(async ({ id }) => {
      const note = await models.Note.findOneById(id);
      const sequence = await models.Sequence.findOneById(note.sequence_id);
      const track = await models.Track.findOneById(sequence.track_id);
      const song = await models.Song.findOneById(track.song_id);

      if (currentUser.id !== song.user_id) {
        throw new ForbiddenError(
          'Logged in user does not have permission to edit this song.',
        );
      }
    });

    const updatedNotes = await models.Note.updateMany(
      notes.map((note) => ({
        id: note.id,
        updates: {
          points: JSON.stringify(note.points),
        },
      })),
    );

    return {
      message: 'Notes were updated successfully.',
      notes: updatedNotes,
      success: true,
    };
  },
};
