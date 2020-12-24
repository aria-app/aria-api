const hashPassword = require('../src/helpers/hashPassword');
const verifyPassword = require('../src/helpers/verifyPassword');
const Song = require('../src/types/Song');
const User = require('../src/types/User');

const DEFAULT_BPM = 120;
const DEFAULT_MEASURE_COUNT = 4;
const SEEDED_USER_PASSWORD =
  'ByeqFjmsA0CcRSYHFo3qxG2HTQkPuSOv8zMpuNtuPGNJrAwFki4XwLWFEnboSZZ';

(async () => {
  try {
    const password = await hashPassword(SEEDED_USER_PASSWORD);

    const [adminUser] = await User.pgModel
      .create({
        email: 'admin@ariaapp.io',
        first_name: 'Alexander',
        last_name: 'Admin',
        password,
      })
      .then((res) => res.rows);

    const [normalUser] = await User.pgModel
      .create({
        email: 'user@ariaapp.io',
        first_name: 'Yorick',
        last_name: 'User',
        password,
      })
      .then((res) => res.rows);

    await Song.pgModel.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT,
      name: 'Admin Arpeggio',
      user_id: adminUser.id,
    });

    await Song.pgModel.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT,
      name: 'Normal Nocturne',
      user_id: normalUser.id,
    });

    const songs = await Song.pgModel.findAll();
    const users = await User.pgModel.findAll();

    console.log('Users', users.rows);
    console.log('Songs', songs.rows);

    process.exit(0);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error While Seeding', e.stack);
    process.exit(1);
  }
})();
