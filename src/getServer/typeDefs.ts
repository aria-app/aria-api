import { gql } from 'apollo-server';

import Note from '../domains/notes';
import Sequence from '../domains/sequences';
import Shared from '../domains/shared';
import Song from '../domains/songs';
import Track from '../domains/tracks';
import User from '../domains/users';
import Voice from '../domains/voices';

export default gql`
  ${Shared.typeDef}
  ${Note.typeDef}
  ${Sequence.typeDef}
  ${Song.typeDef}
  ${Voice.typeDef}
  ${Track.typeDef}
  ${User.typeDef}
`;
