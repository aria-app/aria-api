const hashPassword = require('../src/helpers/hashPassword');
const Admin = require('../src/types/Admin');
const Note = require('../src/types/Note');
const Sequence = require('../src/types/Sequence');
const Song = require('../src/types/Song');
const Track = require('../src/types/Track');
const User = require('../src/types/User');
const Voice = require('../src/types/Voice');
const {
  DEFAULT_BPM,
  DEFAULT_MEASURE_COUNT,
  DEFAULT_VOICE_ID,
} = require('../src/constants');
const defaultVoices = require('./defaultVoices');

const SEEDED_USER_PASSWORD =
  'ByeqFjmsA0CcRSYHFo3qxG2HTQkPuSOv8zMpuNtuPGNJrAwFki4XwLWFEnboSZZ';

(async () => {
  try {
    const password = await hashPassword(SEEDED_USER_PASSWORD);

    const adminUser = await User.pgModel
      .create({
        email: 'admin@ariaapp.io',
        first_name: 'Alexander',
        last_name: 'Admin',
        password,
      })
      .then((res) => res.rows[0]);

    const normalUser = await User.pgModel
      .create({
        email: 'user@ariaapp.io',
        first_name: 'Yorick',
        last_name: 'User',
        password,
      })
      .then((res) => res.rows[0]);

    await Admin.pgModel.create({
      user_id: adminUser.id,
    });

    const adminUserSong = await Song.pgModel
      .create({
        bpm: DEFAULT_BPM,
        date_modified: new Date(),
        measure_count: DEFAULT_MEASURE_COUNT,
        name: 'Admin Arpeggio',
        user_id: adminUser.id,
      })
      .then((res) => res.rows[0]);

    const normalUserSong = await Song.pgModel
      .create({
        bpm: DEFAULT_BPM,
        date_modified: new Date(),
        measure_count: DEFAULT_MEASURE_COUNT,
        name: 'Normal Nocturne',
        user_id: normalUser.id,
      })
      .then((res) => res.rows[0]);

    await Promise.all(
      defaultVoices.map(async (defaultVoice) => {
        await Voice.pgModel.create(defaultVoice);
      }),
    );

    const adminUserTrack = await Track.pgModel
      .create({
        song_id: adminUserSong.id,
        voice_id: DEFAULT_VOICE_ID,
      })
      .then((res) => res.rows[0]);

    // const normalUserTrack = await Track.pgModel
    await Track.pgModel
      .create({
        song_id: normalUserSong.id,
        voice_id: DEFAULT_VOICE_ID,
      })
      .then((res) => res.rows[0]);

    const adminUserSequence = await Sequence.pgModel
      .create({
        measure_count: 1,
        position: 0,
        track_id: adminUserTrack.id,
      })
      .then((res) => res.rows[0]);

    await Note.pgModel.create({
      points: JSON.stringify([
        { x: 0, y: 24 },
        { x: 3, y: 24 },
      ]),
      sequence_id: adminUserSequence.id,
    });

    // Create Sequences
    // Create Notes

    const results = {
      users: await User.pgModel.findAll().then((res) => res.rows),
      admins: await Admin.pgModel.findAll().then((res) => res.rows),
      songs: await Song.pgModel.findAll().then((res) => res.rows),
      tracks: await Track.pgModel.findAll().then((res) => res.rows),
      sequences: await Sequence.pgModel.findAll().then((res) => res.rows),
      notes: await Note.pgModel.findAll().then((res) => res.rows),
      voices: await Voice.pgModel.findAll().then((res) => res.rows),
    };

    console.log('Results', results);

    process.exit(0);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error While Seeding', e.stack);
    process.exit(1);
  }
})();
