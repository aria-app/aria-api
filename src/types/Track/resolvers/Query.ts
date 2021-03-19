export default {
  track: (_, { id }, { prisma }) =>
    prisma.track.findUnique({
      include: {
        sequences: {
          include: {
            track: {
              select: {
                id: true,
              },
            },
          },
        },
        song: true,
        voice: true,
      },
      where: {
        id: parseInt(id, 10),
      },
    }),
  tracks: (_, { songId }, { prisma }) =>
    prisma.track.findMany({
      include: {
        sequences: {
          include: {
            track: {
              select: {
                id: true,
              },
            },
          },
        },
        song: true,
        voice: true,
      },
      where: {
        song: {
          id: parseInt(songId, 10),
        },
      },
    }),
};
