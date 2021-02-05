const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const getMockDb = require('../../../db/getMockDb');
const getServer = require('../../../getServer');

const db = getMockDb();
const server = getServer({ db, skipAuth: true });

const DUPLICATE_NOTES = gql`
  mutation DuplicateNotes($ids: [ID]!) {
    duplicateNotes(ids: $ids) {
      message
      notes {
        id
        points {
          x
          y
        }
        sequence {
          id
        }
      }
      success
    }
  }
`;

const songUnderTest = {
  id: 1,
  notes: [
    {
      id: 1,
      points: [
        { x: 4, y: 38 },
        { x: 5, y: 38 },
      ],
      sequence_id: 1,
    },
    {
      id: 2,
      points: [
        { x: 6, y: 38 },
        { x: 7, y: 38 },
      ],
      sequence_id: 1,
    },
    {
      id: 3,
      points: [
        { x: 8, y: 38 },
        { x: 9, y: 38 },
      ],
      sequence_id: 1,
    },
  ],
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
  user_id: 1,
};

describe('Mutation.duplicateNotes', () => {
  beforeEach(() => {
    db.client.query.mockReset();

    const { sequences, tracks } = songUnderTest;

    db.client.query
      .mockReturnValueOnce({
        rows: [
          {
            id: 2,
            points: [
              { x: 6, y: 38 },
              { x: 7, y: 38 },
            ],
            sequence_id: 1,
          },
          {
            id: 3,
            points: [
              { x: 8, y: 38 },
              { x: 9, y: 38 },
            ],
            sequence_id: 1,
          },
        ],
      })
      .mockReturnValueOnce({ rows: [sequences[0]] })
      .mockReturnValueOnce({ rows: [tracks[0]] })
      .mockReturnValueOnce({ rows: [songUnderTest] })
      .mockReturnValueOnce({
        rows: [
          {
            id: 4,
            points: [
              { x: 6, y: 38 },
              { x: 7, y: 38 },
            ],
            sequence_id: 1,
          },
        ],
      })
      .mockReturnValueOnce({
        rows: [
          {
            id: 5,
            points: [
              { x: 8, y: 38 },
              { x: 9, y: 38 },
            ],
            sequence_id: 1,
          },
        ],
      })
      .mockReturnValueOnce({ rows: [sequences[0]] })
      .mockReturnValueOnce({ rows: [sequences[0]] });
  });

  it('should invoke correct mutation', async () => {
    const { mutate } = createTestClient(server);

    const result = await mutate({
      mutation: DUPLICATE_NOTES,
      variables: { ids: ['2', '3'] },
    });

    expect(result.errors).not.toBeDefined();
    expect(db.client.query).toHaveBeenCalledTimes(8);
    expect(db.client.query.mock.calls[0]).toEqual([
      'SELECT * FROM notes WHERE id IN ($1,$2);',
      ['2', '3'],
    ]);
    expect(db.client.query.mock.calls[1][0]).toBe(
      'SELECT * FROM sequences WHERE id = 1 LIMIT 1;',
    );
    expect(db.client.query.mock.calls[2][0]).toBe(
      'SELECT * FROM tracks WHERE id = 1 LIMIT 1;',
    );
    expect(db.client.query.mock.calls[3][0]).toBe(
      'SELECT * FROM songs WHERE id = 1 LIMIT 1;',
    );
    expect(db.client.query.mock.calls[4]).toEqual([
      'INSERT INTO notes(points, sequence_id) VALUES($1,$2) RETURNING *;',
      ['[{"x":6,"y":38},{"x":7,"y":38}]', 1],
    ]);
    expect(db.client.query.mock.calls[5]).toEqual([
      'INSERT INTO notes(points, sequence_id) VALUES($1,$2) RETURNING *;',
      ['[{"x":8,"y":38},{"x":9,"y":38}]', 1],
    ]);
    expect(db.client.query.mock.calls[6][0]).toBe(
      'SELECT * FROM sequences WHERE id = 1 LIMIT 1;',
    );
    expect(db.client.query.mock.calls[7][0]).toBe(
      'SELECT * FROM sequences WHERE id = 1 LIMIT 1;',
    );
  });

  it('should return correct response', async () => {
    const { mutate } = createTestClient(server);

    const result = await mutate({
      mutation: DUPLICATE_NOTES,
      variables: { ids: ['2', '3'] },
    });

    expect(result.errors).not.toBeDefined();
    expect(result.data.duplicateNotes).toEqual({
      message: 'Notes were duplicated successfully.',
      notes: [
        {
          id: '4',
          points: [
            { x: 6, y: 38 },
            { x: 7, y: 38 },
          ],
          sequence: { id: '1' },
        },
        {
          id: '5',
          points: [
            { x: 8, y: 38 },
            { x: 9, y: 38 },
          ],
          sequence: { id: '1' },
        },
      ],
      success: true,
    });
  });
});
