module.exports = {
  voice: (_, { id }, { models }) => models.Voice.findOneById(id),
};
