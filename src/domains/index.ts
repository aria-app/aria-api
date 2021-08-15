import { gql } from 'apollo-server';
import merge from 'lodash/merge';

import * as songs from './songs';
import * as users from './users';
import * as voices from './voices';

export * from './songs';

export const resolvers = merge(
  songs.resolvers,
  voices.resolvers,
  users.resolvers,
);

export const typeDefs = gql`
  ${songs.typeDefs}
  ${voices.typeDefs}
  ${users.typeDefs}
`;
