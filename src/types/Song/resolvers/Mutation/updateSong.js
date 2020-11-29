const { AuthenticationError, ForbiddenError } = require('apollo-server');
const model = require('../../model');

module.exports = async function updateSong(
  _,
  { id, updates },
  { currentUser },
) {
  if (!currentUser) {
    throw new AuthenticationError('You are not authenticated.');
  }

  const song = await model.findById(id);

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
};
