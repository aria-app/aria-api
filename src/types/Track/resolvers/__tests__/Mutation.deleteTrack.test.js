const { ForbiddenError } = require('apollo-server');

const Mutation = require('../Mutation');

const context = {
  currentUser: { id: 1 },
  models: {
    Song: {
      findOneById: jest.fn().mockReturnValue({
        id: 1234,
        user_id: 1,
      }),
    },
    Track: {
      delete: jest.fn(),
      findOneById: jest.fn().mockReturnValue({
        id: 999,
        song_id: 1234,
      }),
    },
  },
};

describe('deleteTrack mutation', () => {
  it('should return correct response', async () => {
    const result = await Mutation.deleteTrack(null, { id: 99 }, context);

    expect(result).toEqual({
      message: 'Track was deleted successfully.',
      success: true,
    });
  });

  it('should call Track.delete with correct parameters', async () => {
    await Mutation.deleteTrack(null, { id: 99 }, context);

    expect(context.models.Track.delete).toHaveBeenCalledWith(99);
  });

  it('should throw error when current user does not own song containing track', async () => {
    expect.assertions(2);

    context.models.Song.findOneById.mockReturnValue({
      id: 1234,
      user_id: 2,
    });

    try {
      await Mutation.deleteTrack(null, { id: 99 }, context);
    } catch (e) {
      expect(e instanceof ForbiddenError).toBe(true);
      expect(e.message).toBe(
        'Logged in user does not have permission to edit this song.',
      );
    }
  });
});
