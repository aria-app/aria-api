const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const getMockDb = require('../../../db/getMockDb');
const getServer = require('../../../getServer');

const db = getMockDb();
const server = getServer({ db, skipAuth: true });

const GET_VOICE = gql`
  query GetVoice($id: ID!) {
    voice(id: $id) {
      id
      name
      toneOscillatorType
    }
  }
`;

describe('voice Query', () => {
  beforeEach(() => {
    db.client.query.mockReset();
  });

  it('should invoke correct query', async () => {
    const { query } = createTestClient(server);

    await query({
      query: GET_VOICE,
      variables: {
        id: 1,
      },
    });

    expect(db.client.query).toHaveBeenCalledWith(
      'SELECT * FROM voices WHERE id = 1 LIMIT 1;',
    );
  });

  it('should return correct response', async () => {
    db.client.query.mockReturnValue({
      rows: [{ id: 1, name: 'foo', tone_oscillator_type: 'foo' }],
    });

    const { query } = createTestClient(server);

    const result = await query({
      query: GET_VOICE,
      variables: {
        id: 1,
      },
    });

    expect(result.data.voice).toEqual({
      id: '1',
      name: 'foo',
      toneOscillatorType: 'foo',
    });
  });
});
