const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server');
const map = require('lodash/fp/map');
const Sequence = require('../../../../models/Sequence');
const Track = require('../../../../models/Track');
const model = require('../../model');

module.exports = async function song(_, { id }, { currentUser }) {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const dbSong = await model.findById(id);

  if (!dbSong) {
    throw new ApolloError('Song was not found', 'NOT_FOUND');
  }

  if (String(currentUser._id) !== String(dbSong.userId)) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  const songTracks = await Track.model.find({ songId: dbSong._id });
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
    ...dbSong.toObject(),
    tracks: songTracksWithSequences,
  };
};
