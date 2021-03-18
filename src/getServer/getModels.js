const Note = require('../types/Note');
const Sequence = require('../types/Sequence');
const Song = require('../types/Song');
const Track = require('../types/Track');
const User = require('../types/User');

module.exports = function getModels(db) {
  return {
    Note: Note.getModel(db),
    Sequence: Sequence.getModel(db),
    Song: Song.getModel(db),
    Track: Track.getModel(db),
    User: User.getModel(db),
  };
};
