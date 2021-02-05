module.exports = {
  sequence: (_, { id }, { models }) => models.Sequence.findOneById(id),
};
