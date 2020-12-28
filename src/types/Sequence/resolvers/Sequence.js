module.exports = {
  measureCount: (sequence) => sequence.measure_count,
  notes: (sequence, args, { models }) =>
    models.Note.findBySequenceId(sequence.id),
  track: (sequence, args, { models }) =>
    models.Track.findOneById(sequence.track_id),
};
