import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    song(id: Int!): Song
    songs(
      limit: Int
      page: Int
      search: String
      sort: String
      sortDirection: String
      userId: Int
    ): SongsResponse!
  }

  extend type Mutation {
    createSong(input: CreateSongInput!): CreateSongResponse
    deleteSong(id: Int!): DeleteSongResponse
    updateSong(input: UpdateSongInput!): UpdateSongResponse
  }

  input CreateSongInput {
    name: String!
  }

  type CreateSongResponse {
    message: String!
    song: Song!
  }

  type DeleteSongResponse {
    message: String!
    song: Song!
  }

  type Song {
    bpm: Int!
    createdAt: String!
    id: Int!
    measureCount: Int!
    name: String!
    trackCount: Int!
    tracks: [Track]!
    updatedAt: String!
    user: SongUser!
  }

  type SongUser {
    id: Int!
  }

  type SongsResponse {
    data: [Song]!
    meta: PaginationMetadata
  }

  input UpdateSongInput {
    bpm: Int
    id: Int!
    measureCount: Int
    name: String
  }

  type UpdateSongResponse {
    message: String!
    song: Song!
  }
`;
