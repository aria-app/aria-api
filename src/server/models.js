const Admin = require('../types/Admin');
const Note = require('../types/Note');
const Sequence = require('../types/Sequence');
const Song = require('../types/Song');
const Track = require('../types/Track');
const User = require('../types/User');
const Voice = require('../types/Voice');

module.exports = {
  Admin: Admin.model,
  Note: Note.model,
  Sequence: Sequence.model,
  Song: Song.model,
  Voice: Voice.model,
  Track: Track.model,
  User: User.model,
};
