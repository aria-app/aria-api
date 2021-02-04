require('dotenv').config();
const pg = require('pg');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    client.query('BEGIN');
    const result = await callback(client);
    client.query('COMMIT');
    return result;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
    client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
