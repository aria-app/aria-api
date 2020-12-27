const map = require('lodash/fp/map');

const Sequence = require('../../Sequence');
const model = require('../model');

module.exports = {
  track: (_, { id }) => model.findOneById(id),
  tracks: async (_, { songId }) => {
    const tracks = await model.findBySongId(songId);

    return Promise.all(
      map(
        (track) =>
          Sequence.model
            .findByTrackId(track.id)
            .then((sequences) => ({ ...track, sequences })),
        tracks,
      ),
    );
  },
};
