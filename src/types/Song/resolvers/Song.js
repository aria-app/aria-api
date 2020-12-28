module.exports = {
  dateCreated: (song) => song.date_created.toISOString(),
  dateModified: (song) => song.date_modified.toISOString(),
  measureCount: (song) => song.measure_count,
  trackCount: (song, args, { models }) =>
    models.Track.findBySongId(song.id).then((tracks) => tracks.length),
  tracks: (song, args, { models }) => models.Track.findBySongId(song.id),
  user: (song, args, { models }) => models.User.findOneById(song.user_id),
};
