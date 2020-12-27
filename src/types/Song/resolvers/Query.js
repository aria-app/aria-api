const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server');
const Admin = require('../../Admin');
const model = require('../model');

module.exports = {
  song: async (_, { id }, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const song = await model.findOneById(id);

    if (!song) {
      throw new ApolloError('Song was not found', 'NOT_FOUND');
    }

    const isAdmin = !!(await Admin.model.findOneByUserId(currentUser.id));

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
    { currentUser },
  ) => {
    if (!currentUser) {
      throw new AuthenticationError('You are not authenticated.');
    }

    const isAdmin = !!(await Admin.model.findOneByUserId(currentUser.id));

    if (!isAdmin && userId && String(currentUser.id) !== String(userId)) {
      throw new ForbiddenError('You are not authorized to view this data.');
    }

    const allSongs = await model.find({
      search,
      sort,
      sortDirection,
      userId: !isAdmin || userId ? userId || currentUser.id : undefined,
    });

    const songsPage = await model.find({
      search,
      limit,
      offset: page - 1,
      sort,
      sortDirection,
      userId: !isAdmin || userId ? userId || currentUser.id : undefined,
    });

    return {
      data: songsPage,
      meta: {
        currentPage: page,
        itemsPerPage: limit === 'ALL' ? allSongs.length : limit,
        totalItemCount: allSongs.length,
      },
    };
  },
};
