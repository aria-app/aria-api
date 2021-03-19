import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    voice(id: ID!): Voice
    voices: [Voice]!
  }

  type Voice {
    id: ID!
    name: String!
    toneOscillatorType: String!
  }
`;
