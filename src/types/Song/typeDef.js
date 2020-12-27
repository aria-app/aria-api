const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    song(id: ID!): Song
    songs(
      limit: Int
      page: Int
      search: String
      sort: String
      sortDirection: String
      userId: ID
    ): SongsResponse!
  }

  extend type Mutation {
    createSong(options: CreateSongInput!): CreateSongResponse
    deleteSong(id: ID!): DeleteSongResponse
    updateSong(id: ID!, updates: UpdateSongInput!): UpdateSongResponse
  }

  input CreateSongInput {
    name: String!
  }

  type CreateSongResponse {
    message: String!
    song: Song
    success: Boolean!
  }

  type DeleteSongResponse {
    message: String!
    success: Boolean!
  }

  input UpdateSongInput {
    bpm: Int
    measureCount: Int
    name: String
  }

  type UpdateSongResponse {
    message: String!
    song: Song
    success: Boolean!
  }

  type Song {
    bpm: Int!
    dateCreated: String!
    dateModified: String!
    id: ID!
    measureCount: Int!
    name: String!
    tracks: [Track]
    userId: ID!
    user: User!
  }

  type SongsResponse {
    data: [SongsResponseItem]
    meta: PaginationMetadata
  }

  type SongsResponseItem {
    dateCreated: String!
    dateModified: String!
    id: ID!
    measureCount: Int!
    name: String!
    trackCount: Int!
    userId: ID!
  }
`;
