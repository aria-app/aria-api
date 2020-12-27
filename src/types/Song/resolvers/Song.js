const Track = require('../../Track');
const User = require('../../User');

module.exports = {
  dateCreated: (song) => song.date_created.toISOString(),
  dateModified: (song) => song.date_modified.toISOString(),
  measureCount: (song) => song.measure_count,
  tracks: (song) => Track.model.findBySongId(song.id),
  userId: (song) => song.user_id,
  user: (song) => User.model.findOneById(song.user_id),
};
