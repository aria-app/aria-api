const { gql } = require('apollo-server');

const Note = require('../types/Note');
const Sequence = require('../types/Sequence');
const Shared = require('../types/Shared');
const Song = require('../types/Song');
const Track = require('../types/Track');
const User = require('../types/User');

module.exports = gql`
  ${Shared.typeDef}
  ${Note.typeDef}
  ${Sequence.typeDef}
  ${Song.typeDef}
  ${Track.typeDef}
  ${User.typeDef}
`;
