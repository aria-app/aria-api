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
    _empty: String
  }
  type Mutation {
    _empty: String
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
  Mutation: {
    updateSong: async (_, { id, updates }) => {
      try {
        console.log('updates', updates);
        const updatedSong = await Song.model.findByIdAndUpdate(id, updates, {
          new: true,
        });

        return {
          message: 'Song was updated successfully.',
          song: updatedSong,
          success: true,
        };
      } catch (e) {
        return {
          message: 'Song could not be updated.',
          song: null,
          success: false,
        };
      }
    },
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
