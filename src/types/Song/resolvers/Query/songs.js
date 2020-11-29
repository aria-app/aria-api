const { AuthenticationError, ForbiddenError } = require('apollo-server');
const isNil = require('lodash/fp/isNil');
const map = require('lodash/fp/map');
const omitBy = require('lodash/fp/omitBy');
const Admin = require('../../../../models/Admin');
const Track = require('../../../../models/Track');
const model = require('../../model');

module.exports = async function songs(_, { userId }, { currentUser }) {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const isAdmin = Admin.model.exists({ userId: currentUser._id });

  if (!isAdmin && String(currentUser._id) !== String(userId)) {
    throw new ForbiddenError('You are not authorized to view this data.');
  }

  const dbSongs = await model
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
  }, dbSongs);
};
