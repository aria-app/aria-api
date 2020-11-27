require('dotenv').config();
const getOr = require('lodash/fp/getOr');
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

const Sequence = require('./models/Sequence');
const Track = require('./models/Track');
const Song = require('./models/Song');
const User = require('./models/User');

const getId = getOr(undefined, '_id');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const typeDefs = gql`
  type Query {
    sequences: [Sequence]
    songs: [Song]
    tracks: [Track]
    users: [User]
  }
  ${Sequence.typeDef}
  ${Song.typeDef}
  ${Track.typeDef}
  ${User.typeDef}
`;

const resolvers = {
  Query: {
    sequences: () => Sequence.model.find({}),
    songs: () => Song.model.find({}),
    tracks: () => Track.model.find({}),
    users: () => User.model.find({}),
  },
  Sequence: {
    id: getId,
  },
  Song: {
    id: getId,
  },
  Track: {
    id: getId,
  },
  User: {
    id: getId,
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
