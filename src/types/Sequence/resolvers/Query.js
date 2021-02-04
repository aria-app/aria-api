module.exports = {
  sequence: (_, { id }, { models }) => models.Sequence.findOneById(id),
  songSequences: async (_, { songId }, { models }) => {
    const tracks = await models.Track.findBySongId(songId);
    return Promise.all(
      tracks.map((track) => models.Sequence.findByTrackId(track.id)),
    ).then((sequences) => sequences.flat());
  },
};
