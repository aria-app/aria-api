const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    song(id: ID!): Song
    songs(userId: ID): [SongsResponseItem]!
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

  type SongsResponseItem {
    dateModified: String!
    id: ID!
    measureCount: Int!
    name: String!
    trackCount: Int!
    userId: ID!
  }
`;
