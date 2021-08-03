import { gql } from 'apollo-server';
import merge from 'lodash/merge';

import note from './notes';
import sequence from './sequences';
import song from './songs';
import track from './tracks';
import user from './users';
import voice from './voices';

export const resolvers = merge(
  note.resolvers,
  sequence.resolvers,
  song.resolvers,
  voice.resolvers,
  track.resolvers,
  user.resolvers,
);

export const typeDef = gql`
  ${note.typeDef}
  ${sequence.typeDef}
  ${song.typeDef}
  ${voice.typeDef}
  ${track.typeDef}
  ${user.typeDef}
`;
