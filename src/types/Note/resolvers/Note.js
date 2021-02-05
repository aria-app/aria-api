module.exports = {
  points: (note) => JSON.parse(note.points),
  sequence: (note, args, { models }) =>
    models.Sequence.findOneById(note.sequence_id),
};
