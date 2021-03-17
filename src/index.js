require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const db = require('./db');
const getServer = require('./getServer');

const prisma = new PrismaClient();
console.log(prisma);
const server = getServer({ db });

server.listen(process.env.PORT).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
