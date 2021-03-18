module.exports = {
  sequences: (track, args, { models }) =>
    models.Sequence.findByTrackId(track.id),
  song: (track, args, { prisma }) =>
    prisma.song.findUnique({ where: { id: parseInt(track.songId, 10) } }),
  voice: (track, args, { prisma }) =>
    prisma.voice.findUnique({ where: { id: parseInt(track.voiceId, 10) } }),
};
