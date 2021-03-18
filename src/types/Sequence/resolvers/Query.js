module.exports = {
  sequence: (_, { id }, { prisma }) =>
    prisma.sequence.findUnique({
      include: {
        notes: {
          include: {
            sequence: {
              select: {
                id: true,
              },
            },
          },
        },
        track: true,
      },
      where: { id: parseInt(id, 10) },
    }),
};
