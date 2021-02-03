const Mutation = require('../Mutation');

const args = {
  input: { songId: 1234 },
};

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
      create: jest.fn(),
      findBySongId: jest.fn().mockReturnValue([
        {
          id: 1,
          position: 1,
          sequences: [],
          song_id: 1234,
        },
        {
          id: 2,
          position: 2,
          sequences: [],
          song_id: 1234,
        },
      ]),
    },
  },
};

describe('createTrack resolver', () => {
  it('should return correct response', async () => {
    context.models.Track.create.mockImplementation((options) => ({
      ...options,
      id: 999,
    }));

    const result = await Mutation.createTrack(null, args, context);

    expect(result).toEqual({
      message: 'Track was created successfully.',
      success: true,
      track: {
        id: 999,
        position: 3,
        song_id: 1234,
        voice_id: 9,
      },
    });
  });

  it('should call Track.create with correct parameters', async () => {
    await Mutation.createTrack(null, args, context);

    expect(context.models.Track.create).toHaveBeenCalledWith({
      position: 3,
      song_id: 1234,
      voice_id: 9,
    });
  });
});
