module.exports = {
  trackCount: (song) => song.tracks.length,
  updatedAt: (song) => song.updatedAt.toISOString(),
};
