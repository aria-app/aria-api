require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

const Song = require('./models/Song');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const typeDefs = gql`
  type Query {
    songs: [Song]
  }

  ${Song.typeDef}
`;

const resolvers = {
  Query: {
    songs: () => Song.model.find({}),
  },
};

const server = new ApolloServer({ resolvers, typeDefs });

server.listen(process.env.PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
