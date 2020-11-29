const { gql } = require('apollo-server');

const Sequence = require('../types/Sequence');
const Song = require('../types/Song');
const Track = require('../types/Track');
const User = require('../types/User');

module.exports = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  ${Sequence.typeDef}
  ${Song.typeDef}
  ${Track.typeDef}
  ${User.typeDef}
`;
