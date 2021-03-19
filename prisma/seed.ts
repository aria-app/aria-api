import { PrismaClient, Role } from '@prisma/client';

import constants from '../src/constants';
import hashPassword from '../src/helpers/hashPassword';
import defaultVoices from './defaultVoices';

const { DEFAULT_BPM, DEFAULT_MEASURE_COUNT } = constants;

const prisma = new PrismaClient();
const SEEDED_USER_PASSWORD =
  'ByeqFjmsA0CcRSYHFo3qxG2HTQkPuSOv8zMpuNtuPGNJrAwFki4XwLWFEnboSZZ';

async function main() {
  const password = await hashPassword(SEEDED_USER_PASSWORD);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ariaapp.io',
      firstName: 'Alexander',
      lastName: 'Admin',
      password,
      role: Role.ADMIN,
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      email: 'user@ariaapp.io',
      firstName: 'Yorick',
      lastName: 'User',
      password,
    },
  });

  const adminUserSong = await prisma.song.create({
    data: {
      bpm: DEFAULT_BPM,
      measureCount: DEFAULT_MEASURE_COUNT,
      name: 'Admin Arpeggio',
      userId: adminUser.id,
    },
  });

  await prisma.song.create({
    data: {
      bpm: DEFAULT_BPM,
      measureCount: DEFAULT_MEASURE_COUNT + 10,
      name: 'Second Song',
      userId: adminUser.id,
    },
  });

  await prisma.song.create({
    data: {
      bpm: DEFAULT_BPM,
      measureCount: DEFAULT_MEASURE_COUNT,
      name: 'Third Song',
      userId: adminUser.id,
    },
  });

  const normalUserSong = await prisma.song.create({
    data: {
      bpm: DEFAULT_BPM,
      measureCount: DEFAULT_MEASURE_COUNT,
      name: 'Normal Nocturne',
      userId: normalUser.id,
    },
  });

  const voices = [
    await prisma.voice.create({
      data: defaultVoices[0],
    }),
    await prisma.voice.create({
      data: defaultVoices[1],
    }),
    await prisma.voice.create({
      data: defaultVoices[2],
    }),
    await prisma.voice.create({
      data: defaultVoices[3],
    }),
    await prisma.voice.create({
      data: defaultVoices[4],
    }),
    await prisma.voice.create({
      data: defaultVoices[5],
    }),
    await prisma.voice.create({
      data: defaultVoices[6],
    }),
    await prisma.voice.create({
      data: defaultVoices[7],
    }),
    await prisma.voice.create({
      data: defaultVoices[8],
    }),
    await prisma.voice.create({
      data: defaultVoices[9],
    }),
  ];

  const adminUserTrack = await prisma.track.create({
    data: {
      position: 0,
      songId: adminUserSong.id,
    },
  });

  const normalUserTrack = await prisma.track.create({
    data: {
      position: 0,
      songId: normalUserSong.id,
    },
  });

  const adminUserSequence = await prisma.sequence.create({
    data: {
      measureCount: 1,
      position: 0,
      trackId: adminUserTrack.id,
    },
  });

  const normalUserSequence = await prisma.sequence.create({
    data: {
      measureCount: 1,
      position: 0,
      trackId: normalUserTrack.id,
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
    notePointSets.map((notePointSet) =>
      prisma.note.create({
        data: {
          points: notePointSet,
          sequenceId: adminUserSequence.id,
        },
      }),
    ),
  );

  const normalUserNotes = await Promise.all(
    notePointSets.map((notePointSet) =>
      prisma.note.create({
        data: {
          points: notePointSet,
          sequenceId: normalUserSequence.id,
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
