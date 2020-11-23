require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

mongoose.connect(
  `mongodb+srv://admin:${process.env.ADMIN_PASSWORD}@cluster0.rt2ka.mongodb.net/sample_mflix?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
);

const db = mongoose.connection;

const commentSchema = new mongoose.Schema({
  date: Date,
  email: String,
  movie_id: mongoose.ObjectId,
  name: String,
  text: String,
});

const Comment = mongoose.model('Comment', commentSchema);

db.once('open', () => {
  console.log('connected to MongoDB!');
  Comment.findOne({ name: 'Ronald Cox' })
    .then((comments) => {
      console.log('comments', comments);
    })
    .catch((error) => {
      console.error(error);
    });
});

const typeDefs = gql`
  type Query {
    books: [Book]
  }

  type Book {
    author: String
    title: String
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({ resolvers, typeDefs });

server.listen(process.env.PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
