const { gql } = require('apollo-server');
const { model, ObjectId, Schema } = require('mongoose');

const noteSchema = new Schema({
  points: [
    {
      x: Number,
      y: Number,
    },
  ],
});

module.exports = {
  model: model(
    'Sequence',
    new Schema({
      measureCount: Number,
      notes: [noteSchema],
      position: Number,
      trackId: ObjectId,
    }),
  ),
  typeDef: gql`
    extend type Query {
      sequence(id: ID!): Sequence
    }

    type Note {
      id: ID!
      points: [Point]
    }

    type Point {
      x: Int!
      y: Int!
    }

    type Sequence {
      id: ID!
      measureCount: Int!
      notes: [Note]
      position: Int!
      trackId: ID!
    }

    input NoteUpdateInput {
      points: [PointUpdateInput]
    }

    input PointUpdateInput {
      x: Int
      y: Int
    }

    input SequenceUpdateInput {
      measureCount: Int
      notes: [NoteUpdateInput]
      position: Int
    }
  `,
};
