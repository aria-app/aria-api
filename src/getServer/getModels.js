const Admin = require('../types/Admin');
const Note = require('../types/Note');
const Sequence = require('../types/Sequence');
const Song = require('../types/Song');
const Track = require('../types/Track');
const User = require('../types/User');
const Voice = require('../types/Voice');

module.exports = function getModels(db) {
  return {
    Admin: Admin.getModel(db),
    Note: Note.getModel(db),
    Sequence: Sequence.getModel(db),
    Song: Song.getModel(db),
    Voice: Voice.getModel(db),
    Track: Track.getModel(db),
    User: User.getModel(db),
  };
};
