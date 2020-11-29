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
const merge = require('lodash/fp/merge');
const mongoose = require('mongoose');

const User = require('./models/User');
const Admin = require('./models/Admin');
const Song = require('./types/Song');
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

const resolvers = merge(Song.resolvers, {
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

      return User.model.find({}).sort({ firstName: 'asc', email: 'asc' });
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
  },
  Note: {
    id: getId,
  },
  Sequence: {
    id: getId,
  },
  Track: {
    id: getId,
  },
  User: {
    id: getId,
  },
});

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
