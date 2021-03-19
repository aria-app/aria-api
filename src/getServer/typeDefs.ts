import { gql } from 'apollo-server';

import Note from '../types/Note';
import Sequence from '../types/Sequence';
import Shared from '../types/Shared';
import Song from '../types/Song';
import Track from '../types/Track';
import User from '../types/User';
import Voice from '../types/Voice';

export default gql`
  ${Shared.typeDef}
  ${Note.typeDef}
  ${Sequence.typeDef}
  ${Song.typeDef}
  ${Voice.typeDef}
  ${Track.typeDef}
  ${User.typeDef}
`;
