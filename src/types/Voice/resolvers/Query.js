module.exports = {
  voice: (_, { id }, { models }) => models.Voice.findOneById(id),
  voices: (_, __, { models }) => models.Voice.findAll(),
};
