const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} = require('apollo-server');
const isEqual = require('lodash/fp/isEqual');
const isNil = require('lodash/fp/isNil');
const max = require('lodash/fp/max');
const omitBy = require('lodash/fp/omitBy');

const { DEFAULT_VOICE_ID } = require('../../../constants');

module.exports = {
  createTrack: async (_, { input }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await models.Song.findOneById(input.songId);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    const otherTracks = await models.Track.findBySongId(input.songId);
    const prevMaxPosition =
      max(otherTracks.map((track) => track.position)) || 0;

    const newTrack = await models.Track.create({
      position: prevMaxPosition + 1,
      song_id: input.songId,
      voice_id: DEFAULT_VOICE_ID,
    });

    return {
      message: 'Track was created successfully.',
      success: true,
      track: newTrack,
    };
  },

  deleteTrack: async (_, { id }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const track = await models.Track.findOneById(id);
    const song = await models.Song.findOneById(track.song_id);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    await models.Track.delete(id);

    return {
      message: 'Track was deleted successfully.',
      success: true,
    };
  },

  updateTrack: async (_, { input }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const track = await models.Track.findOneById(input.id);
    const song = await models.Song.findOneById(track.song_id);

    if (currentUser.id !== song.user_id) {
      throw new ForbiddenError(
        'You are not authorized to perform this action.',
      );
    }

    if (
      isEqual(
        {
          voice_id: input.voiceId,
          volume: input.volume,
        },
        {
          voice_id: track.voice_id,
          volume: track.volume,
        },
      )
    ) {
      throw new UserInputError('No changes submitted');
    }

    const updatedTrack = await models.Track.update(
      input.id,
      omitBy(isNil, {
        voice_id: input.voiceId,
        volume: input.volume,
      }),
    );

    return {
      message: 'Track was updated successfully.',
      track: updatedTrack,
      success: true,
    };
  },
};
