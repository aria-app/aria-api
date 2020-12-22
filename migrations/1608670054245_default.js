/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    date_created: {
      default: pgm.func('current_timestamp'),
      notNull: true,
      type: 'timestamp',
    },
    email: {
      notNull: true,
      type: 'varchar(255)',
    },
    first_name: {
      notNull: true,
      type: 'varchar(255)',
    },
    last_name: {
      notNull: true,
      type: 'varchar(255)',
    },
    password: {
      notNull: true,
      type: 'varchar(255)',
    },
  });
  pgm.createTable('songs', {
    id: 'id',
    bpm: {
      notNull: true,
      type: 'smallint',
    },
    date_created: {
      default: pgm.func('current_timestamp'),
      notNull: true,
      type: 'timestamp',
    },
    date_modified: {
      default: pgm.func('current_timestamp'),
      notNull: true,
      type: 'timestamp',
    },
    measure_count: {
      notNull: true,
      type: 'smallint',
    },
    name: {
      notNull: true,
      type: 'varchar(255)',
    },
    user_id: {
      notNull: true,
      onDelete: 'cascade',
      references: '"users"',
      type: 'integer',
    },
  });
  pgm.createTable('voices', {
    id: 'id',
    name: {
      notNull: true,
      type: 'varchar(255)',
    },
  });
  pgm.createTable('tracks', {
    id: 'id',
    is_muted: {
      default: false,
      notNull: true,
      type: 'boolean',
    },
    is_soloing: {
      default: false,
      notNull: true,
      type: 'boolean',
    },
    song_id: {
      notNull: true,
      onDelete: 'cascade',
      references: '"songs"',
      type: 'integer',
    },
    voice_id: {
      notNull: true,
      onDelete: 'restrict',
      references: '"voices"',
      type: 'integer',
    },
    volume: {
      notNull: true,
      type: 'smallint',
    },
  });
  pgm.createTable('sequences', {
    id: 'id',
    bpm: {
      notNull: true,
      type: 'smallint',
    },
    measure_count: {
      notNull: true,
      type: 'smallint',
    },
    notes: {
      default: '[]',
      notNull: true,
      type: 'json',
    },
    position: {
      notNull: true,
      type: 'smallint',
    },
    track_id: {
      notNull: true,
      onDelete: 'cascade',
      references: '"tracks"',
      type: 'integer',
    },
  });
  pgm.createIndex('sequences', 'track_id');
  pgm.createIndex('songs', 'user_id');
  pgm.createIndex('tracks', 'song_id');
};
