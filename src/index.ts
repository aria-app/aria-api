import { getServer } from './server';

require('dotenv').config();

const server = getServer();

server.listen(process.env.PORT).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
