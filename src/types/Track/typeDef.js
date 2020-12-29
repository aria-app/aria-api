const { gql } = require('apollo-server');

module.exports = gql`
  extend type Mutation {
    deleteTrack(id: ID!): DeleteTrackResponse
    updateTrack(input: UpdateTrackInput!): UpdateTrackResponse
  }

  extend type Query {
    track(id: ID!): Track
    tracks(songId: ID!): [Track]!
  }

  type DeleteTrackResponse {
    message: String!
    success: Boolean!
  }

  type Track {
    id: ID!
    isMuted: Boolean!
    isSoloing: Boolean!
    position: Int!
    sequences: [Sequence]!
    song: Song!
    voice: Voice!
    volume: Int!
  }

  input UpdateTrackInput {
    id: ID!
    voiceId: ID
    volume: Int
  }

  type UpdateTrackResponse {
    message: String!
    success: Boolean!
    track: Track!
  }
`;
