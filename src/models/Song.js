const { gql } = require('apollo-server');
const { model, ObjectId, Schema } = require('mongoose');

module.exports = {
  model: model(
    'Song',
    new Schema({
      bpm: Number,
      dateModified: String,
      measureCount: Number,
      name: String,
      userId: ObjectId,
    }),
  ),
  typeDef: gql`
    type Song {
      bpm: Int!
      dateModified: String!
      id: ID!
      measureCount: Int!
      name: String!
      tracks: [Track]
      userId: ID!
    }
  `,
};
