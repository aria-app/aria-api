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
      unique: true,
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
  pgm.createTable('admins', {
    id: 'id',
    user_id: {
      notNull: true,
      onDelete: 'cascade',
      references: '"users"',
      type: 'integer',
      unique: true,
    },
  });
  pgm.createTable(
    'songs',
    {
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
    },
    {
      constraints: {
        unique: [['name', 'user_id']],
      },
    },
  );
  pgm.createTable('voices', {
    id: 'id',
    name: {
      notNull: true,
      type: 'varchar(255)',
    },
    tone_oscillator_type: {
      notNull: true,
      type: 'varchar(255)',
    },
  });
  pgm.createTable(
    'tracks',
    {
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
      position: {
        notNull: true,
        type: 'smallint',
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
        default: -10,
        notNull: true,
        type: 'smallint',
      },
    },
    {
      constraints: {
        unique: [['position', 'song_id']],
      },
    },
  );
  pgm.createTable('sequences', {
    id: 'id',
    measure_count: {
      notNull: true,
      type: 'smallint',
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
  pgm.createTable('notes', {
    id: 'id',
    points: {
      default: '[]',
      notNull: true,
      type: 'json',
    },
    sequence_id: {
      notNull: true,
      onDelete: 'cascade',
      references: '"sequences"',
      type: 'integer',
    },
  });
  pgm.createIndex('notes', 'sequence_id');
  pgm.createIndex('sequences', 'track_id');
  pgm.createIndex('songs', 'user_id');
  pgm.createIndex('tracks', 'song_id');
};
