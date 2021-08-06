import { gql } from 'apollo-server';

import * as domains from '../domains';
import * as shared from '../shared';

export const typeDefs = gql`
  ${shared.typeDefs}
  ${domains.typeDefs}
`;
