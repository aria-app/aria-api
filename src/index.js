require('dotenv').config();
const {
  ApolloError,
  ApolloServer,
  AuthenticationError,
  ForbiddenError,
  gql,
  ValidationError,
} = require('apollo-server');
const isEmail = require('isemail');
const getOr = require('lodash/fp/getOr');
const map = require('lodash/fp/map');
const mongoose = require('mongoose');

const Sequence = require('./models/Sequence');
const Song = require('./models/Song');
const Track = require('./models/Track');
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
    song: async (_, { id }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You are not authenticated.');
      }

      const song = await Song.model.findById(id);

      if (!song) {
        throw new ApolloError('Song was not found', 'NOT_FOUND');
      }

      if (String(user._id) !== String(song.userId)) {
        throw new ForbiddenError('You are not authorized to view this data.');
      }

      const songTracks = await Track.model.find({ songId: song._id });
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
    login: async (_, { email }) => {
      if (!isEmail.validate(email)) {
        throw new ValidationError('Email format invalid.');
      }

      const user = await User.model.findOne({ email });

      if (!user) {
        throw new ApolloError('User with that email not found.', 'NOT_FOUND');
      }

      return {
        success: true,
        token: Buffer.from(email).toString('base64'),
      };
    },
    register: async (_, { email }) => {
      if (!isEmail.validate(email)) {
        throw new ValidationError('Email format invalid.');
      }

      const previousUser = await User.model.findOne({ email });

      if (!!previousUser) {
        throw new ValidationError('User with that email already exists.');
      }

      const user = new User.model({ email });

      await user.save();

      return {
        success: true,
        token: Buffer.from(email).toString('base64'),
      };
    },
    updateSong: async (_, { id, updates }, { user }) => {
      if (!user) {
        throw new AuthenticationError('You are not authenticated.');
      }
      try {
        const song = await Song.model.findById(id);

        if (String(user._id) !== String(song.userId)) {
          throw new ForbiddenError('You are not authorized to view this data.');
        }

        song.set(updates);

        song.save();

        return {
          message: 'Song was updated successfully.',
          song,
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
  context: async ({ req }) => {
    const authorization = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(authorization, 'base64').toString('ascii');

    if (!isEmail.validate(email)) return { user: null };

    const user = await User.model.findOne({ email });

    return { user };
  },
  introspection: true,
  playground: true,
  resolvers,
  typeDefs,
});

server.listen(process.env.PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
