module.exports = {
  track: (_, { id }, { models }) => models.Track.findOneById(id),
  tracks: (_, { songId }, { models }) => models.Track.findBySongId(songId),
};
