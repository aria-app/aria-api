const map = require('lodash/fp/map');

const Sequence = require('../../Sequence');
const pgModel = require('../pgModel');

module.exports = {
  track: (_, { id }) => pgModel.findOneById(id),
  tracks: async (_, { songId }) => {
    const tracks = await pgModel.findBySongId(songId);

    return Promise.all(
      map(
        (track) =>
          Sequence.pgModel
            .findByTrackId(track.id)
            .then((sequences) => ({ ...track, sequences })),
        tracks,
      ),
    );
  },
};
