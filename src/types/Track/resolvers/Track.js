module.exports = {
  isMuted: (track) => track.is_muted,
  isSoloing: (track) => track.is_soloing,
  sequences: (track, args, { models }) =>
    models.Sequence.findByTrackId(track.id),
  song: (track, args, { models }) => models.Song.findOneById(track.song_id),
  voice: (track, args, { prisma }) =>
    prisma.voice.findUnique({ where: { id: parseInt(track.voice_id, 10) } }),
};
