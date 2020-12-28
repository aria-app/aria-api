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

    const adminUser = await User.model.create({
      email: 'admin@ariaapp.io',
      first_name: 'Alexander',
      last_name: 'Admin',
      password,
    });

    const normalUser = await User.model.create({
      email: 'user@ariaapp.io',
      first_name: 'Yorick',
      last_name: 'User',
      password,
    });

    await Admin.model.create({
      user_id: adminUser.id,
    });

    const adminUserSong = await Song.model.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT,
      name: 'Admin Arpeggio',
      user_id: adminUser.id,
    });

    await Song.model.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT + 10,
      name: 'Second Song',
      user_id: adminUser.id,
    });

    await Song.model.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT,
      name: 'Third Song',
      user_id: adminUser.id,
    });

    const normalUserSong = await Song.model.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT,
      name: 'Normal Nocturne',
      user_id: normalUser.id,
    });

    await Promise.all(
      defaultVoices.map(async (defaultVoice) => {
        await Voice.model.create(defaultVoice);
      }),
    );

    const adminUserTrack = await Track.model.create({
      position: 0,
      song_id: adminUserSong.id,
      voice_id: DEFAULT_VOICE_ID,
    });

    const normalUserTrack = await Track.model.create({
      position: 0,
      song_id: normalUserSong.id,
      voice_id: DEFAULT_VOICE_ID,
    });

    const adminUserSequence = await Sequence.model.create({
      measure_count: 1,
      position: 0,
      track_id: adminUserTrack.id,
    });

    const normalUserSequence = await Sequence.model.create({
      measure_count: 1,
      position: 0,
      track_id: normalUserTrack.id,
    });

    await Note.model.create({
      points: JSON.stringify([
        { x: 0, y: 24 },
        { x: 3, y: 24 },
      ]),
      sequence_id: adminUserSequence.id,
    });

    await Note.model.create({
      points: JSON.stringify([
        { x: 0, y: 28 },
        { x: 3, y: 28 },
      ]),
      sequence_id: normalUserSequence.id,
    });

    // eslint-disable-next-line no-console
    console.log('Seeding complete!');
    process.exit(0);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error While Seeding', e.stack);
    process.exit(1);
  }
})();
