import { PrismaClient } from '@prisma/client';

import { PrismaSongRepository } from './domains';
import { getServer } from './server';

require('dotenv').config();

const prismaClient = new PrismaClient();

const server = getServer({
  prismaClient,
  repositories: {
    songRepository: new PrismaSongRepository(prismaClient),
  },
  skipAuth: false,
});

server.listen(process.env.PORT).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
