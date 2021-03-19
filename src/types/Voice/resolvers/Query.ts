export default {
  voice: (_, { id }, { prisma }) =>
    prisma.voice.findUnique({ where: { id: parseInt(id, 10) } }),
  voices: (_, __, { prisma }) =>
    prisma.voice.findMany({ orderBy: { name: 'asc' } }),
};
