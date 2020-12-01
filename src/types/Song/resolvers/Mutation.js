const { AuthenticationError, ForbiddenError } = require('apollo-server');
const model = require('../model');

const DEFAULT_BPM = 120;
const DEFAULT_MEASURE_COUNT = 4;

module.exports = {
  createSong: async (_, { options }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = new model({
      bpm: DEFAULT_BPM,
      dateModified: new Date(),
      measureCount: DEFAULT_MEASURE_COUNT,
      userId: currentUser._id,
      ...options,
    });

    song.save();

    return {
      message: 'Song was created successfully.',
      song,
      success: true,
    };
  },

  deleteSong: async (_, { id }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await model.findById(id);

    if (String(currentUser._id) !== String(song.userId)) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    await model.findByIdAndDelete(id);

    return {
      message: 'Song was deleted successfully.',
      success: true,
    };
  },

  updateSong: async (_, { id, updates }, { currentUser }) => {
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

    song.set({ dateModified: new Date() });

    song.save();

    return {
      message: 'Song was updated successfully.',
      song,
      success: true,
    };
  },
};
