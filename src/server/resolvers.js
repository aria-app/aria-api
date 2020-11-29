const merge = require('lodash/merge');

const Sequence = require('../types/Sequence');
const Song = require('../types/Song');
const Track = require('../types/Track');
const User = require('../types/User');

module.exports = merge(
  Sequence.resolvers,
  Song.resolvers,
  Track.resolvers,
  User.resolvers,
);
