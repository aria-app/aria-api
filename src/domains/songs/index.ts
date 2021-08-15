import { merge } from 'lodash';

import * as songsResolvers from './resolvers';
import * as notes from './subdomains/notes';
import * as sequences from './subdomains/sequences';
import * as tracks from './subdomains/tracks';

export * from './mappers';
export * from './repositories';
export * from './typeDefs';

export const resolvers = merge(
  notes.resolvers,
  sequences.resolvers,
  songsResolvers,
  tracks.resolvers,
);
