const merge = require('lodash/merge');

const Note = require('../types/Note');
const Sequence = require('../types/Sequence');
const Song = require('../types/Song');
const Track = require('../types/Track');
const User = require('../types/User');
const Voice = require('../types/Voice');

module.exports = merge(
  Note.resolvers,
  Sequence.resolvers,
  Song.resolvers,
  Voice.resolvers,
  Track.resolvers,
  User.resolvers,
);
