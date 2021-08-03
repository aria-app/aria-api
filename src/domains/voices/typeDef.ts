import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    voice(id: Int!): Voice
    voices: [Voice]!
  }

  type Voice {
    id: Int!
    name: String!
    toneOscillatorType: String!
  }
`;
