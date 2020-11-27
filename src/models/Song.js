const { gql } = require('apollo-server');
const { model, ObjectId, Schema } = require('mongoose');
const Track = require('./Track');

module.exports = {
  model: model(
    'Song',
    new Schema({
      bpm: Number,
      dateModified: Number,
      measureCount: Number,
      name: String,
      userId: ObjectId,
    }),
  ),
  typeDef: gql`
    type Song {
      bpm: Int!
      dateModified: Int!
      id: ID!
      measureCount: Int!
      name: String!
      tracks: [Track]
      userId: ID!
    }
  `,
};
