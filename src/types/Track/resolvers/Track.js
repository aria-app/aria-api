const Sequence = require('../../Sequence');
const Voice = require('../../Voice');

module.exports = {
  isMuted: (track) => track.is_muted,
  isSoloing: (track) => track.is_soloing,
  sequences: (track) => Sequence.model.findByTrackId(track.id),
  songId: (track) => track.song_id,
  voice: (track) => Voice.model.findOneById(track.voice_id),
};
