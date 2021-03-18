require('dotenv').config();

const db = require('./db');
const getServer = require('./getServer');

const server = getServer({ db, skipAuth: true });

server.listen(process.env.PORT).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
