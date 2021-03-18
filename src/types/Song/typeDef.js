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
    updateSong(input: UpdateSongInput!): UpdateSongResponse
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
    id: ID!
    measureCount: Int
    name: String
  }

  type UpdateSongResponse {
    message: String!
    song: Song!
    success: Boolean!
  }

  type Song {
    bpm: Int!
    createdAt: String!
    id: ID!
    measureCount: Int!
    name: String!
    trackCount: Int!
    tracks: [Track]!
    updatedAt: String!
    user: User!
  }

  type SongsResponse {
    data: [Song]
    meta: PaginationMetadata
  }
`;
