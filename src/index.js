require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const getOr = require('lodash/fp/getOr');
const map = require('lodash/fp/map');
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
    sequence(id: ID!): Sequence
    song(id: ID!): Song
    songs: [Song]!
    tracks: [Track]!
    users: [User]!
  }
  ${Sequence.typeDef}
  ${Song.typeDef}
  ${Track.typeDef}
  ${User.typeDef}
`;

const resolvers = {
  Query: {
    sequence: (_, { id }) => Sequence.model.findById(id),
    song: async (_, { id }) => {
      const song = await Song.model.findById(id);
      const songTracks = await Track.model.find({ songId: id });
      const songTracksWithSequences = Promise.all(
        map(
          (track) =>
            Sequence.model
              .find({ trackId: track._id })
              .then((sequences) => ({ ...track.toObject(), sequences })),
          songTracks,
        ),
      );

      return {
        ...song.toObject(),
        tracks: songTracksWithSequences,
      };
    },
    songs: () => Song.model.find({}),
    tracks: async (_, { songId }) => {
      const tracks = await Track.model.find({ songId });

      return Promise.all(
        map(
          (track) =>
            Sequence.model
              .find({ trackId: track._id })
              .then((sequences) => ({ ...track.toObject(), sequences })),
          tracks,
        ),
      );
    },
    users: () => User.model.find({}),
  },
  Note: {
    id: getId,
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
