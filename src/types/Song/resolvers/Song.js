module.exports = {
  dateModified: (song) => song.dateModified.toISOString(),
  id: (song) => song._id,
};
