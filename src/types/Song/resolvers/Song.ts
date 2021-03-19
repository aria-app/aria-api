export default {
  createdAt: (song) => song.createdAt.toISOString(),
  trackCount: (song) => song.tracks.length,
  updatedAt: (song) => song.updatedAt.toISOString(),
};
