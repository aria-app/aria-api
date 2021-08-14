import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Mutation {
    createTrack(input: CreateTrackInput!): CreateTrackResponse
    deleteTrack(id: Int!): DeleteTrackResponse
    updateTrack(input: UpdateTrackInput!): UpdateTrackResponse
  }

  input CreateTrackInput {
    songId: Int!
  }

  type CreateTrackResponse {
    message: String!
    track: Track
  }

  type DeleteTrackResponse {
    message: String!
    track: Track!
  }

  type Track {
    id: Int!
    isMuted: Boolean!
    isSoloing: Boolean!
    position: Int!
    sequences: [Sequence]!
    song: TrackSong!
    voice: Voice!
    volume: Int!
  }

  type TrackSong {
    id: Int!
  }

  input UpdateTrackInput {
    id: Int!
    voiceId: Int
    volume: Int
  }

  type UpdateTrackResponse {
    message: String!
    track: Track!
  }
`;
