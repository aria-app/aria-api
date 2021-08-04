import { gql } from 'apollo-server';

export const typeDef = gql`
  extend type Mutation {
    createTrack(input: CreateTrackInput!): CreateTrackResponse
    deleteTrack(id: Int!): DeleteTrackResponse
    updateTrack(input: UpdateTrackInput!): UpdateTrackResponse
  }

  extend type Query {
    track(id: Int!): Track
    tracks(songId: Int!): [Track]!
  }

  input CreateTrackInput {
    songId: Int!
  }

  type CreateTrackResponse {
    message: String!
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
    track: Track
  }

  type DeleteTrackResponse {
    message: String!
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
    track: Track!
  }

  type Track {
    id: Int!
    isMuted: Boolean!
    isSoloing: Boolean!
    position: Int!
    sequences: [Sequence]!
    song: Song!
    voice: Voice!
    volume: Int!
  }

  input UpdateTrackInput {
    id: Int!
    voiceId: Int
    volume: Int
  }

  type UpdateTrackResponse {
    message: String!
    success: Boolean!
      @deprecated(
        reason: "Success fields are deprecated in favor of returning meaningful data."
      )
    track: Track!
  }
`;
