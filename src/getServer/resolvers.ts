import merge from 'lodash/merge';

import Note from '../types/Note';
import Sequence from '../types/Sequence';
import Song from '../types/Song';
import Track from '../types/Track';
import User from '../types/User';
import Voice from '../types/Voice';

export default merge(
  Note.resolvers,
  Sequence.resolvers,
  Song.resolvers,
  Voice.resolvers,
  Track.resolvers,
  User.resolvers,
);
