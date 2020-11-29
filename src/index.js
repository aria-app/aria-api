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
const isNil = require('lodash/fp/isNil');
const map = require('lodash/fp/map');
const omitBy = require('lodash/fp/omitBy');
const mongoose = require('mongoose');

const User = require('./models/User');
const Admin = require('./models/Admin');
const Song = require('./models/Song');
const Track = require('./models/Track');
const Sequence = require('./models/Sequence');

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
    me: (_, __, { currentUser }) => {
      if (!currentUser) {
        return null;
      }

      const isAdmin = Admin.model.exists({ userId: currentUser._id });

      return {
        email: currentUser.email,
        firstName: currentUser.firstName,
        id: currentUser._id,
        isAdmin: !!isAdmin,
        lastName: currentUser.lastName,
      };
    },
    sequence: (_, { id }) => Sequence.model.findById(id),
    song: async (_, { id }, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('You are not authenticated.');
      }

      const song = await Song.model.findById(id);

      if (!song) {
        throw new ApolloError('Song was not found', 'NOT_FOUND');
      }

      if (String(currentUser._id) !== String(song.userId)) {
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
    songs: async (_, { userId }, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('You are not authenticated.');
      }

      const isAdmin = Admin.model.exists({ userId: currentUser._id });

      if (!isAdmin && String(currentUser._id) !== String(userId)) {
        throw new ForbiddenError('You are not authorized to view this data.');
      }

      const songs = await Song.model
        .find(omitBy(isNil, { userId }))
        .sort({ name: 'asc' });

      return map(async (song) => {
        const trackCount = await Track.model.count({ songId: song._id });

        return {
          dateModified: song.dateModified,
          id: song._id,
          measureCount: song.measureCount,
          name: song.name,
          userId: song.userId,
          trackCount,
        };
      }, songs);
    },
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
    users: (_, __, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('You are not authenticated.');
      }

      const isAdmin = Admin.model.exists({ userId: currentUser._id });

      if (!isAdmin) {
        throw new ForbiddenError('You are not authorized to view this data.');
      }

      return User.model.find({});
    },
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
        user,
      };
    },
    register: async (_, { email }) => {
      if (!isEmail.validate(email)) {
        throw new ValidationError('Email format invalid.');
      }

      const previousUser = await User.model.findOne({ email });

      if (previousUser) {
        throw new ValidationError('User with that email already exists.');
      }

      const user = new User.model({ email });

      await user.save();

      return {
        success: true,
        token: Buffer.from(email).toString('base64'),
      };
    },
    updateSong: async (_, { id, updates }, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('You are not authenticated.');
      }

      const song = await Song.model.findById(id);

      if (String(currentUser._id) !== String(song.userId)) {
        throw new ForbiddenError('You are not authorized to view this data.');
      }

      song.set(updates);

      if (!song.isModified()) {
        return {
          message: 'Song was not modified.',
          success: false,
        };
      }

      song.save();

      return {
        message: 'Song was updated successfully.',
        song,
        success: true,
      };
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

    if (!isEmail.validate(email)) return { currentUser: null };
    const currentUser = await User.model.findOne({ email });

    return { currentUser };
  },
  introspection: true,
  playground: true,
  resolvers,
  typeDefs,
});

server.listen(process.env.PORT).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
