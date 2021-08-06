import { gql } from 'apollo-server';
import merge from 'lodash/merge';

import * as notes from './notes';
import * as sequences from './sequences';
import * as songs from './songs';
import * as tracks from './tracks';
import * as users from './users';
import * as voices from './voices';

export const resolvers = merge(
  notes.resolvers,
  sequences.resolvers,
  songs.resolvers,
  voices.resolvers,
  tracks.resolvers,
  users.resolvers,
);

export const typeDef = gql`
  ${notes.typeDef}
  ${sequences.typeDef}
  ${songs.typeDef}
  ${voices.typeDef}
  ${tracks.typeDef}
  ${users.typeDef}
`;
