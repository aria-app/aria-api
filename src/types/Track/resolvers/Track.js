const Sequence = require('../../Sequence');
const Voice = require('../../Voice');

module.exports = {
  isMuted: (track) => track.is_muted,
  isSoloing: (track) => track.is_soloing,
  sequences: (track) => Sequence.pgModel.findByTrackId(track.id),
  songId: (track) => track.song_id,
  voice: (track) => Voice.pgModel.findOneById(track.voice_id),
};
