const Note = require('../types/Note');
const Sequence = require('../types/Sequence');
const Track = require('../types/Track');

module.exports = function getModels(db) {
  return {
    Note: Note.getModel(db),
    Sequence: Sequence.getModel(db),
    Track: Track.getModel(db),
  };
};
