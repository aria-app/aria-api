module.exports = {
  sequence: (note, args, { models }) =>
    models.Sequence.findOneById(note.sequence_id),
};
