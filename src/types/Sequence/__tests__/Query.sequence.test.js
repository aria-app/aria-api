const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const getMockDb = require('../../../db/getMockDb');
const getServer = require('../../../getServer');

const db = getMockDb();
const server = getServer({ db, skipAuth: true });

const GET_SEQUENCE = gql`
  query GetSequence($id: ID!) {
    sequence(id: $id) {
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
  notes: [{ id: 1 }],
  sequences: [
    {
      id: 1,
      measure_count: 1,
      position: 0,
      track_id: 1,
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
  ],
};

describe('Query.sequence', () => {
  beforeEach(() => {
    db.client.query.mockReset();

    const { notes, sequences, tracks } = songUnderTest;

    db.client.query
      .mockReturnValueOnce({ rows: [sequences[0]] })
      .mockReturnValueOnce({ rows: [notes[0]] })
      .mockReturnValueOnce({ rows: [tracks[0]] });
  });

  it('should invoke correct query', async () => {
    const { query } = createTestClient(server);

    await query({
      query: GET_SEQUENCE,
      variables: {
        id: 1,
      },
    });

    expect(db.client.query).toHaveBeenCalledTimes(3);
    expect(db.client.query.mock.calls[0][0]).toBe(
      'SELECT * FROM sequences WHERE id = 1 LIMIT 1;',
    );
    expect(db.client.query.mock.calls[1][0]).toBe(
      'SELECT * FROM notes WHERE sequence_id = 1;',
    );
    expect(db.client.query.mock.calls[2][0]).toBe(
      'SELECT * FROM tracks WHERE id = 1 LIMIT 1;',
    );
  });

  it('should return correct response', async () => {
    const { query } = createTestClient(server);

    const result = await query({
      query: GET_SEQUENCE,
      variables: {
        id: 1,
      },
    });

    expect(result.errors).not.toBeDefined();
    expect(result.data.sequence).toEqual({
      id: '1',
      measureCount: 1,
      notes: [{ id: '1' }],
      position: 0,
      track: { id: '1' },
    });
  });
});
