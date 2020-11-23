require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

const Song = require('./models/Song');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const typeDefs = gql`
  type Query {
    songs: [Song]
    users: [User]
  }
  ${Song.typeDef}
  ${User.typeDef}
`;

const resolvers = {
  Query: {
    songs: () => Song.model.find({}),
    users: () => User.model.find({}),
  },
  Song: {
    id: (song) => song._id,
  },
  User: {
    id: (user) => user._id,
  },
};

const server = new ApolloServer({
  introspection: true,
  playground: true,
  resolvers,
  typeDefs,
});

server.listen(process.env.PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
