const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const getMockDb = require('../../../db/getMockDb');
const getServer = require('../../../getServer');

const db = getMockDb();
const server = getServer({ db, skipAuth: true });

const GET_SONG_SEQUENCES = gql`
  query GetSongSequence($songId: ID!) {
    songSequences(songId: $songId) {
      id
      measureCount
      notes {
        id
      }
      position
      track {
        id
      }
    }
  }
`;

const songUnderTest = {
  notes: [{ id: 1 }, { id: 2 }],
  sequences: [
    {
      id: 1,
      measure_count: 1,
      position: 0,
      track_id: 1,
    },
    {
      id: 2,
      measure_count: 1,
      position: 0,
      track_id: 2,
    },
  ],
  tracks: [
    {
      id: 1,
      is_muted: false,
      is_soloing: false,
      position: 0,
      song_id: 1,
      voice_id: 9,
      volume: -10,
    },
    {
      id: 2,
      is_muted: false,
      is_soloing: false,
      position: 1,
      song_id: 1,
      voice_id: 9,
      volume: -10,
    },
  ],
};

describe('Query.sequence', () => {
  beforeEach(() => {
    db.client.query.mockReset();

    const { notes, sequences, tracks } = songUnderTest;

    db.client.query
      .mockReturnValueOnce({ rows: tracks })
      .mockReturnValueOnce({ rows: [sequences[0]] })
      .mockReturnValueOnce({ rows: [sequences[1]] })
      .mockReturnValueOnce({ rows: [notes[0]] })
      .mockReturnValueOnce({ rows: [tracks[0]] })
      .mockReturnValueOnce({ rows: [notes[1]] })
      .mockReturnValueOnce({ rows: [tracks[1]] });
  });

  it('should invoke correct query', async () => {
    const { query } = createTestClient(server);

    const result = await query({
      query: GET_SONG_SEQUENCES,
      variables: {
        songId: 1,
      },
    });

    expect(result.errors).not.toBeDefined();
    expect(db.client.query).toHaveBeenCalledTimes(7);
    expect(db.client.query.mock.calls[0][0]).toBe(
      'SELECT * FROM tracks WHERE song_id = 1;',
    );
    expect(db.client.query.mock.calls[1][0]).toBe(
      'SELECT * FROM sequences WHERE track_id = 1;',
    );
    expect(db.client.query.mock.calls[2][0]).toBe(
      'SELECT * FROM sequences WHERE track_id = 2;',
    );
    expect(db.client.query.mock.calls[3][0]).toBe(
      'SELECT * FROM notes WHERE sequence_id = 1;',
    );
    expect(db.client.query.mock.calls[4][0]).toBe(
      'SELECT * FROM tracks WHERE id = 1 LIMIT 1;',
    );
    expect(db.client.query.mock.calls[5][0]).toBe(
      'SELECT * FROM notes WHERE sequence_id = 2;',
    );
    expect(db.client.query.mock.calls[6][0]).toBe(
      'SELECT * FROM tracks WHERE id = 2 LIMIT 1;',
    );
  });

  it('should return correct response', async () => {
    const { query } = createTestClient(server);

    const result = await query({
      query: GET_SONG_SEQUENCES,
      variables: {
        songId: 1,
      },
    });

    expect(result.errors).not.toBeDefined();
    expect(result.data.songSequences).toEqual([
      {
        id: '1',
        measureCount: 1,
        notes: [{ id: '1' }],
        position: 0,
        track: { id: '1' },
      },
      {
        id: '2',
        measureCount: 1,
        notes: [{ id: '2' }],
        position: 0,
        track: { id: '2' },
      },
    ]);
  });
});
