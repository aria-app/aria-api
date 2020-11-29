const map = require('lodash/fp/map');

const Sequence = require('../../Sequence');
const model = require('../model');

module.exports = {
  tracks: async (_, { songId }) => {
    const tracks = await model.find({ songId });

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
};
