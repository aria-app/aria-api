const { PrismaClient } = require('@prisma/client');

const {
  DEFAULT_BPM,
  DEFAULT_MEASURE_COUNT,
  DEFAULT_VOICE_ID,
} = require('../src/constants');
const hashPassword = require('../src/helpers/hashPassword');
const defaultVoices = require('./defaultVoices');

const prisma = new PrismaClient();
const SEEDED_USER_PASSWORD =
  'ByeqFjmsA0CcRSYHFo3qxG2HTQkPuSOv8zMpuNtuPGNJrAwFki4XwLWFEnboSZZ';

async function main() {
  const password = await hashPassword(SEEDED_USER_PASSWORD);

  const adminUser = await prisma.user.upsert({
    create: {
      email: 'admin@ariaapp.io',
      firstName: 'Alexander',
      lastName: 'Admin',
      password,
      role: 'ADMIN',
    },
    update: {},
    where: { email: 'admin@ariaapp.io' },
  });

  const normalUser = await prisma.user.upsert({
    create: {
      email: 'user@ariaapp.io',
      firstName: 'Yorick',
      lastName: 'User',
      password,
    },
    update: {},
    where: { email: 'user@ariaapp.io' },
  });

  const adminUserSong = await prisma.song.upsert({
    create: {
      bpm: DEFAULT_BPM,
      measureCount: DEFAULT_MEASURE_COUNT,
      name: 'Admin Arpeggio',
      userId: adminUser.id,
    },
    update: {},
    where: {
      name_userId: {
        name: 'Admin Arpeggio',
        userId: adminUser.id,
      },
    },
  });

  await prisma.song.upsert({
    create: {
      bpm: DEFAULT_BPM,
      measureCount: DEFAULT_MEASURE_COUNT + 10,
      name: 'Second Song',
      userId: adminUser.id,
    },
    update: {},
    where: {
      name_userId: {
        name: 'Second Song',
        userId: adminUser.id,
      },
    },
  });

  await prisma.song.upsert({
    create: {
      bpm: DEFAULT_BPM,
      measureCount: DEFAULT_MEASURE_COUNT,
      name: 'Third Song',
      userId: adminUser.id,
    },
    update: {},
    where: {
      name_userId: {
        name: 'Third Song',
        userId: adminUser.id,
      },
    },
  });

  const normalUserSong = await prisma.song.upsert({
    create: {
      bpm: DEFAULT_BPM,
      measureCount: DEFAULT_MEASURE_COUNT,
      name: 'Normal Nocturne',
      userId: normalUser.id,
    },
    update: {},
    where: {
      name_userId: {
        name: 'Normal Nocturne',
        userId: normalUser.id,
      },
    },
  });

  const voices = await Promise.all(
    defaultVoices.map((defaultVoice, index) =>
      prisma.voice.upsert({
        create: { ...defaultVoice, id: index + 1 },
        update: {},
        where: { id: index + 1 },
      }),
    ),
  );

  const adminUserTrack = await prisma.track.upsert({
    create: {
      position: 0,
      songId: adminUserSong.id,
      voiceId: DEFAULT_VOICE_ID,
    },
    update: {},
    where: {
      position_songId: {
        position: 0,
        songId: adminUserSong.id,
      },
    },
  });

  const normalUserTrack = await prisma.track.upsert({
    create: {
      position: 0,
      songId: normalUserSong.id,
      voiceId: DEFAULT_VOICE_ID,
    },
    update: {},
    where: {
      position_songId: {
        position: 0,
        songId: normalUserSong.id,
      },
    },
  });

  const adminUserSequence = await prisma.sequence.upsert({
    create: {
      id: 1,
      measureCount: 1,
      position: 0,
      trackId: adminUserTrack.id,
    },
    update: {},
    where: {
      id: 1,
    },
  });

  const normalUserSequence = await prisma.sequence.upsert({
    create: {
      id: 2,
      measureCount: 1,
      position: 0,
      trackId: normalUserTrack.id,
    },
    update: {},
    where: {
      id: 2,
    },
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

  const adminUserNotes = await Promise.all(
    notePointSets.map((notePointSet, index) =>
      prisma.note.upsert({
        create: {
          id: index,
          points: JSON.stringify(notePointSet),
          sequenceId: adminUserSequence.id,
        },
        update: {},
        where: {
          id: index,
        },
      }),
    ),
  );

  const normalUserNotes = await Promise.all(
    notePointSets.map((notePointSet, index) =>
      prisma.note.upsert({
        create: {
          id: index + 3,
          points: JSON.stringify(notePointSet),
          sequenceId: normalUserSequence.id,
        },
        update: {},
        where: {
          id: index + 3,
        },
      }),
    ),
  );

  // eslint-disable-next-line no-console
  console.log({
    adminUser,
    adminUserNotes,
    adminUserSequence,
    adminUserSong,
    adminUserTrack,
    normalUser,
    normalUserNotes,
    normalUserSequence,
    normalUserSong,
    normalUserTrack,
    voices,
  });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
