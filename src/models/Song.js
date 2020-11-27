const { gql } = require('apollo-server');
const { model, Schema } = require('mongoose');

module.exports = {
  model: model(
    'Song',
    new Schema({
      bpm: Number,
      dateModified: String,
      measureCount: Number,
      name: String,
      userId: { ref: 'User', type: Schema.Types.ObjectId },
    }),
  ),
  typeDef: gql`
    extend type Query {
      song(id: ID!): Song
      songs: [Song]!
    }

    extend type Mutation {
      updateSong(id: ID!, updates: SongUpdateInput!): UpdateSongResponse
    }

    input SongUpdateInput {
      bpm: Int
      measureCount: Int
      name: String
      tracks: [TrackUpdateInput]
    }

    type UpdateSongResponse {
      message: String!
      song: Song
      success: Boolean!
    }

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
