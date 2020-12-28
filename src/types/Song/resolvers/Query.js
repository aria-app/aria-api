const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server');

module.exports = {
  song: async (_, { id }, { currentUser, models }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await models.Song.findOneById(id);

    if (!song) {
      throw new ApolloError('Song was not found', 'NOT_FOUND');
    }

    const isAdmin = !!(await models.Admin.findOneByUserId(currentUser.id));

    if (!isAdmin && String(currentUser.id) !== String(song.user_id)) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    return song;
  },

  songs: async (
    _,
    {
      limit = 'ALL',
      page = 1,
      search,
      sort = 'name',
      sortDirection = 'asc',
      userId,
    },
    { currentUser, models },
  ) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isAdmin = !!(await models.Admin.findOneByUserId(currentUser.id));

    if (!isAdmin && userId && String(currentUser.id) !== String(userId)) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    const songsPage = await models.Song.find({
      search,
      limit,
      offset: page - 1,
      sort,
      sortDirection,
      userId: !isAdmin || userId ? userId || currentUser.id : undefined,
    });

    const totalItemCount = await models.Song.count({
      search,
      userId: !isAdmin || userId ? userId || currentUser.id : undefined,
    });

    return {
      data: songsPage,
      meta: {
        currentPage: page,
        itemsPerPage: limit === 'ALL' ? totalItemCount : limit,
        totalItemCount,
      },
    };
  },
};
