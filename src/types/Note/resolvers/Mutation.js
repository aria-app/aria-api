const { AuthenticationError, ForbiddenError } = require('apollo-server');

module.exports = {
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
          'You are not authorized to perform this action.',
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
