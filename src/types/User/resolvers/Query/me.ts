import { User } from '@prisma/client';

import ApiContext from '../../../../models/ApiContext';

type MeResolver = (
  parent: Record<string, never>,
  args: Record<string, never>,
  context: ApiContext,
) => User;

export default <MeResolver>function me(parent, args, { currentUser }) {
  return currentUser;
};
