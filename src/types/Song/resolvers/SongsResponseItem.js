const Track = require('../../Track');

module.exports = {
  dateCreated: (song) => song.date_created.toISOString(),
  dateModified: (song) => song.date_modified.toISOString(),
  measureCount: (song) => song.measure_count,
  trackCount: (song) =>
    Track.model.findBySongId(song.id).then((tracks) => tracks.length),
  userId: (song) => song.user_id,
};
