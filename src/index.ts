import 'reflect-metadata';

import { PrismaClient } from '@prisma/client';

import { getContainer, getContext, getServer } from './server';

require('dotenv').config();

const prismaClient = new PrismaClient();

const server = getServer(
  getContext({
    container: getContainer(prismaClient),
    prisma: prismaClient,
    skipAuth: false,
  }),
);

server.listen(process.env.PORT).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
