const {
  DEFAULT_BPM,
  DEFAULT_MEASURE_COUNT,
  DEFAULT_VOICE_ID,
} = require('../src/constants');
const db = require('../src/db');
const getModels = require('../src/getServer/getModels');
const hashPassword = require('../src/helpers/hashPassword');
const defaultVoices = require('./defaultVoices');

const SEEDED_USER_PASSWORD =
  'ByeqFjmsA0CcRSYHFo3qxG2HTQkPuSOv8zMpuNtuPGNJrAwFki4XwLWFEnboSZZ';

(async () => {
  const models = getModels(db);

  try {
    const password = await hashPassword(SEEDED_USER_PASSWORD);

    const adminUser = await models.User.create({
      email: 'admin@ariaapp.io',
      first_name: 'Alexander',
      last_name: 'Admin',
      password,
    });

    const normalUser = await models.User.create({
      email: 'user@ariaapp.io',
      first_name: 'Yorick',
      last_name: 'User',
      password,
    });

    await models.Admin.create({
      user_id: adminUser.id,
    });

    const adminUserSong = await models.Song.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT,
      name: 'Admin Arpeggio',
      user_id: adminUser.id,
    });

    await models.Song.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT + 10,
      name: 'Second Song',
      user_id: adminUser.id,
    });

    await models.Song.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT,
      name: 'Third Song',
      user_id: adminUser.id,
    });

    const normalUserSong = await models.Song.create({
      bpm: DEFAULT_BPM,
      date_modified: new Date(),
      measure_count: DEFAULT_MEASURE_COUNT,
      name: 'Normal Nocturne',
      user_id: normalUser.id,
    });

    await Promise.all(
      defaultVoices.map(async (defaultVoice) => {
        await models.Voice.create(defaultVoice);
      }),
    );

    const adminUserTrack = await models.Track.create({
      position: 0,
      song_id: adminUserSong.id,
      voice_id: DEFAULT_VOICE_ID,
    });

    const normalUserTrack = await models.Track.create({
      position: 0,
      song_id: normalUserSong.id,
      voice_id: DEFAULT_VOICE_ID,
    });

    const adminUserSequence = await models.Sequence.create({
      measure_count: 1,
      position: 0,
      track_id: adminUserTrack.id,
    });

    const normalUserSequence = await models.Sequence.create({
      measure_count: 1,
      position: 0,
      track_id: normalUserTrack.id,
    });

    const notePointSets = [
      [
        { x: 0, y: 36 },
        { x: 1, y: 36 },
      ],
      [
        { x: 4, y: 38 },
        { x: 5, y: 38 },
      ],
      [
        { x: 4, y: 40 },
        { x: 5, y: 40 },
      ],
    ];

    await Promise.all(
      notePointSets.map((notePointSet) =>
        models.Note.create({
          points: JSON.stringify(notePointSet),
          sequence_id: adminUserSequence.id,
        }),
      ),
    );

    await Promise.all(
      notePointSets.map((notePointSet) =>
        models.Note.create({
          points: JSON.stringify(notePointSet),
          sequence_id: normalUserSequence.id,
        }),
      ),
    );

    // eslint-disable-next-line no-console
    console.log('Seeding complete!');
    process.exit(0);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error While Seeding', e.stack);
    process.exit(1);
  }
})();
