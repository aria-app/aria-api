module.exports = {
  trackCount: (song) => song.tracks.length,
  tracks: (song) => song.tracks,
  updatedAt: (song) => song.updatedAt.toISOString(),
  user: (song) => song.user,
};
