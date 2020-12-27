const { AuthenticationError, ForbiddenError } = require('apollo-server');
const model = require('../model');

const DEFAULT_BPM = 120;
const DEFAULT_MEASURE_COUNT = 4;

module.exports = {
  createSong: async (_, { options }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const newSong = await model.create({
      bpm: DEFAULT_BPM,
      measure_count: DEFAULT_MEASURE_COUNT,
      user_id: currentUser.id,
      ...options,
    });

    return {
      message: 'Song was created successfully.',
      song: newSong,
      success: true,
    };
  },

  deleteSong: async (_, { id }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await model.findOneById(id);

    if (String(currentUser.id) !== String(song.user_id)) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    await model.delete(id);

    return {
      message: 'Song was deleted successfully.',
      success: true,
    };
  },

  updateSong: async (_, { id, updates }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await model.findOneById(id);

    if (String(currentUser.id) !== String(song.user_id)) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    const updatedSong = await model.update(id, {
      ...updates,
      date_modified: new Date(),
    });

    return {
      message: 'Song was updated successfully.',
      song: updatedSong,
      success: true,
    };
  },
};
