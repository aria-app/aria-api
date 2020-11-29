const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server');
const isNil = require('lodash/fp/isNil');
const map = require('lodash/fp/map');
const omitBy = require('lodash/fp/omitBy');
const Admin = require('../../Admin');
const Sequence = require('../../Sequence');
const Track = require('../../Track');
const model = require('../model');

module.exports = {
  song: async (_, { id }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await model.findById(id);

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

    const songs = await model
      .find(omitBy(isNil, { userId }))
      .sort({ name: 'asc' });

    return map(async (song) => {
      const trackCount = await Track.model.countDocuments({ songId: song._id });

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
};
