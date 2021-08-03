import merge from 'lodash/merge';

import Note from '../domains/notes';
import Sequence from '../domains/sequences';
import Song from '../domains/songs';
import Track from '../domains/tracks';
import User from '../domains/users';
import Voice from '../domains/voices';

export default merge(
  Note.resolvers,
  Sequence.resolvers,
  Song.resolvers,
  Voice.resolvers,
  Track.resolvers,
  User.resolvers,
);
