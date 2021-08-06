import { gql } from 'apollo-server';

import * as domains from '../domains';
import shared from '../shared';

export const typeDefs = gql`
  ${shared.typeDef}
  ${domains.typeDef}
`;
