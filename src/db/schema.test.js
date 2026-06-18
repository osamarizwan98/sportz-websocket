import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { getTableName, getTableColumns } from 'drizzle-orm';
import { matchStatusEnum, matches, commentary } from './schema.js';

// ─── matchStatusEnum ───────────────────────────────────────────────────────────

describe('matchStatusEnum', () => {
  it('has the correct enum name', () => {
    assert.equal(matchStatusEnum.enumName, 'match_status');
  });

  it('has exactly three status values', () => {
    assert.equal(matchStatusEnum.enumValues.length, 3);
  });

  it('includes "scheduled" as a valid status', () => {
    assert.ok(matchStatusEnum.enumValues.includes('scheduled'));
  });

  it('includes "live" as a valid status', () => {
    assert.ok(matchStatusEnum.enumValues.includes('live'));
  });

  it('includes "finished" as a valid status', () => {
    assert.ok(matchStatusEnum.enumValues.includes('finished'));
  });

  it('does not include unexpected status values', () => {
    const allowed = new Set(['scheduled', 'live', 'finished']);
    for (const val of matchStatusEnum.enumValues) {
      assert.ok(allowed.has(val), `Unexpected enum value: ${val}`);
    }
  });

  it('enum values are in the correct order', () => {
    assert.deepEqual(matchStatusEnum.enumValues, ['scheduled', 'live', 'finished']);
  });
});

// ─── matches table ─────────────────────────────────────────────────────────────

describe('matches table', () => {
  it('has the correct table name', () => {
    assert.equal(getTableName(matches), 'matches');
  });

  describe('columns', () => {
    let cols;
    before(() => {
      cols = getTableColumns(matches);
    });

    it('defines all expected columns', () => {
      const expected = ['id', 'sport', 'homeTeam', 'awayTeam', 'status', 'startTime', 'endTime', 'homeScore', 'awayScore', 'createdAt'];
      for (const col of expected) {
        assert.ok(col in cols, `Missing column: ${col}`);
      }
    });

    it('has exactly 10 columns', () => {
      assert.equal(Object.keys(cols).length, 10);
    });

    // id
    it('id is a serial primary key', () => {
      assert.equal(cols.id.columnType, 'PgSerial');
      assert.equal(cols.id.primary, true);
    });

    it('id has database column name "id"', () => {
      assert.equal(cols.id.name, 'id');
    });

    it('id is not null', () => {
      assert.equal(cols.id.notNull, true);
    });

    // sport
    it('sport is a text column', () => {
      assert.equal(cols.sport.columnType, 'PgText');
    });

    it('sport has database column name "sport"', () => {
      assert.equal(cols.sport.name, 'sport');
    });

    it('sport is not null', () => {
      assert.equal(cols.sport.notNull, true);
    });

    // homeTeam
    it('homeTeam is a text column', () => {
      assert.equal(cols.homeTeam.columnType, 'PgText');
    });

    it('homeTeam has database column name "home_team"', () => {
      assert.equal(cols.homeTeam.name, 'home_team');
    });

    it('homeTeam is not null', () => {
      assert.equal(cols.homeTeam.notNull, true);
    });

    // awayTeam
    it('awayTeam is a text column', () => {
      assert.equal(cols.awayTeam.columnType, 'PgText');
    });

    it('awayTeam has database column name "away_team"', () => {
      assert.equal(cols.awayTeam.name, 'away_team');
    });

    it('awayTeam is not null', () => {
      assert.equal(cols.awayTeam.notNull, true);
    });

    // status
    it('status is an enum column', () => {
      assert.equal(cols.status.columnType, 'PgEnumColumn');
    });

    it('status has database column name "status"', () => {
      assert.equal(cols.status.name, 'status');
    });

    it('status is not null', () => {
      assert.equal(cols.status.notNull, true);
    });

    it('status defaults to "scheduled"', () => {
      assert.equal(cols.status.default, 'scheduled');
      assert.equal(cols.status.hasDefault, true);
    });

    it('status column carries the match_status enum values', () => {
      assert.deepEqual(cols.status.enumValues, ['scheduled', 'live', 'finished']);
    });

    // startTime
    it('startTime is a timestamp column', () => {
      assert.equal(cols.startTime.columnType, 'PgTimestamp');
    });

    it('startTime has database column name "start_time"', () => {
      assert.equal(cols.startTime.name, 'start_time');
    });

    it('startTime is nullable', () => {
      assert.equal(cols.startTime.notNull, false);
    });

    // endTime
    it('endTime is a timestamp column', () => {
      assert.equal(cols.endTime.columnType, 'PgTimestamp');
    });

    it('endTime has database column name "end_time"', () => {
      assert.equal(cols.endTime.name, 'end_time');
    });

    it('endTime is nullable', () => {
      assert.equal(cols.endTime.notNull, false);
    });

    // homeScore
    it('homeScore is an integer column', () => {
      assert.equal(cols.homeScore.columnType, 'PgInteger');
    });

    it('homeScore has database column name "home_score"', () => {
      assert.equal(cols.homeScore.name, 'home_score');
    });

    it('homeScore is not null', () => {
      assert.equal(cols.homeScore.notNull, true);
    });

    it('homeScore defaults to 0', () => {
      assert.equal(cols.homeScore.default, 0);
      assert.equal(cols.homeScore.hasDefault, true);
    });

    // awayScore
    it('awayScore is an integer column', () => {
      assert.equal(cols.awayScore.columnType, 'PgInteger');
    });

    it('awayScore has database column name "away_score"', () => {
      assert.equal(cols.awayScore.name, 'away_score');
    });

    it('awayScore is not null', () => {
      assert.equal(cols.awayScore.notNull, true);
    });

    it('awayScore defaults to 0', () => {
      assert.equal(cols.awayScore.default, 0);
      assert.equal(cols.awayScore.hasDefault, true);
    });

    // createdAt
    it('createdAt is a timestamp column', () => {
      assert.equal(cols.createdAt.columnType, 'PgTimestamp');
    });

    it('createdAt has database column name "created_at"', () => {
      assert.equal(cols.createdAt.name, 'created_at');
    });

    it('createdAt is not null', () => {
      assert.equal(cols.createdAt.notNull, true);
    });

    it('createdAt has a default value (now())', () => {
      assert.equal(cols.createdAt.hasDefault, true);
    });

    // score symmetry regression test
    it('homeScore and awayScore share the same default value of 0', () => {
      assert.equal(cols.homeScore.default, cols.awayScore.default);
    });
  });
});

// ─── commentary table ──────────────────────────────────────────────────────────

describe('commentary table', () => {
  it('has the correct table name', () => {
    assert.equal(getTableName(commentary), 'commentary');
  });

  describe('columns', () => {
    let cols;
    before(() => {
      cols = getTableColumns(commentary);
    });

    it('defines all expected columns', () => {
      const expected = ['id', 'matchId', 'minute', 'sequence', 'period', 'eventType', 'actor', 'team', 'message', 'metadata', 'tags', 'createdAt'];
      for (const col of expected) {
        assert.ok(col in cols, `Missing column: ${col}`);
      }
    });

    it('has exactly 12 columns', () => {
      assert.equal(Object.keys(cols).length, 12);
    });

    // id
    it('id is a serial primary key', () => {
      assert.equal(cols.id.columnType, 'PgSerial');
      assert.equal(cols.id.primary, true);
    });

    it('id has database column name "id"', () => {
      assert.equal(cols.id.name, 'id');
    });

    // matchId
    it('matchId is an integer column', () => {
      assert.equal(cols.matchId.columnType, 'PgInteger');
    });

    it('matchId has database column name "match_id"', () => {
      assert.equal(cols.matchId.name, 'match_id');
    });

    it('matchId is not null', () => {
      assert.equal(cols.matchId.notNull, true);
    });

    // minute
    it('minute is an integer column', () => {
      assert.equal(cols.minute.columnType, 'PgInteger');
    });

    it('minute has database column name "minute"', () => {
      assert.equal(cols.minute.name, 'minute');
    });

    it('minute is not null', () => {
      assert.equal(cols.minute.notNull, true);
    });

    // sequence
    it('sequence is an integer column', () => {
      assert.equal(cols.sequence.columnType, 'PgInteger');
    });

    it('sequence has database column name "sequence"', () => {
      assert.equal(cols.sequence.name, 'sequence');
    });

    it('sequence is not null', () => {
      assert.equal(cols.sequence.notNull, true);
    });

    // period
    it('period is a varchar column', () => {
      assert.equal(cols.period.columnType, 'PgVarchar');
    });

    it('period has database column name "period"', () => {
      assert.equal(cols.period.name, 'period');
    });

    it('period is not null', () => {
      assert.equal(cols.period.notNull, true);
    });

    it('period has a max length of 50', () => {
      assert.equal(cols.period.config.length, 50);
    });

    // eventType
    it('eventType is a varchar column', () => {
      assert.equal(cols.eventType.columnType, 'PgVarchar');
    });

    it('eventType has database column name "event_type"', () => {
      assert.equal(cols.eventType.name, 'event_type');
    });

    it('eventType is not null', () => {
      assert.equal(cols.eventType.notNull, true);
    });

    it('eventType has a max length of 100', () => {
      assert.equal(cols.eventType.config.length, 100);
    });

    // actor
    it('actor is a text column', () => {
      assert.equal(cols.actor.columnType, 'PgText');
    });

    it('actor has database column name "actor"', () => {
      assert.equal(cols.actor.name, 'actor');
    });

    it('actor is nullable', () => {
      assert.equal(cols.actor.notNull, false);
    });

    // team
    it('team is a text column', () => {
      assert.equal(cols.team.columnType, 'PgText');
    });

    it('team has database column name "team"', () => {
      assert.equal(cols.team.name, 'team');
    });

    it('team is nullable', () => {
      assert.equal(cols.team.notNull, false);
    });

    // message
    it('message is a text column', () => {
      assert.equal(cols.message.columnType, 'PgText');
    });

    it('message has database column name "message"', () => {
      assert.equal(cols.message.name, 'message');
    });

    it('message is not null', () => {
      assert.equal(cols.message.notNull, true);
    });

    // metadata
    it('metadata is a jsonb column', () => {
      assert.equal(cols.metadata.columnType, 'PgJsonb');
    });

    it('metadata has database column name "metadata"', () => {
      assert.equal(cols.metadata.name, 'metadata');
    });

    it('metadata is nullable', () => {
      assert.equal(cols.metadata.notNull, false);
    });

    it('metadata defaults to an empty object', () => {
      assert.deepEqual(cols.metadata.default, {});
      assert.equal(cols.metadata.hasDefault, true);
    });

    // tags
    it('tags is an array column', () => {
      assert.equal(cols.tags.columnType, 'PgArray');
    });

    it('tags has database column name "tags"', () => {
      assert.equal(cols.tags.name, 'tags');
    });

    it('tags is nullable', () => {
      assert.equal(cols.tags.notNull, false);
    });

    it('tags is an array of text elements', () => {
      assert.equal(cols.tags.config.baseBuilder.config.columnType, 'PgText');
    });

    // createdAt
    it('createdAt is a timestamp column', () => {
      assert.equal(cols.createdAt.columnType, 'PgTimestamp');
    });

    it('createdAt has database column name "created_at"', () => {
      assert.equal(cols.createdAt.name, 'created_at');
    });

    it('createdAt is not null', () => {
      assert.equal(cols.createdAt.notNull, true);
    });

    it('createdAt has a default value (now())', () => {
      assert.equal(cols.createdAt.hasDefault, true);
    });
  });

  describe('foreign key to matches', () => {
    it('matchId references the matches table via Symbol(drizzle:PgInlineForeignKeys)', () => {
      const fkSymbol = Symbol.for('drizzle:PgInlineForeignKeys');
      const fks = commentary[fkSymbol];
      assert.ok(Array.isArray(fks), 'Expected PgInlineForeignKeys to be an array');
      assert.ok(fks.length > 0, 'Expected at least one foreign key on commentary');
    });

    it('matchId foreign key references matches.id with cascade delete', () => {
      const fkSymbol = Symbol.for('drizzle:PgInlineForeignKeys');
      const fks = commentary[fkSymbol];
      // find the FK for match_id
      const fk = fks.find(f => {
        const ref = f.reference();
        return ref.columns.some(c => c.name === 'match_id');
      });
      assert.ok(fk, 'Foreign key for match_id not found');
      const ref = fk.reference();
      assert.equal(getTableName(ref.foreignTable), 'matches');
      assert.ok(ref.foreignColumns.some(c => c.name === 'id'));
    });

    it('matchId foreign key has onDelete: cascade', () => {
      const fkSymbol = Symbol.for('drizzle:PgInlineForeignKeys');
      const fks = commentary[fkSymbol];
      const fk = fks.find(f => {
        const ref = f.reference();
        return ref.columns.some(c => c.name === 'match_id');
      });
      assert.ok(fk);
      assert.equal(fk.onDelete, 'cascade');
    });
  });
});

// ─── cross-table structural checks ────────────────────────────────────────────

describe('schema structural integrity', () => {
  it('both tables are distinct objects', () => {
    assert.notEqual(matches, commentary);
  });

  it('both tables have different names', () => {
    assert.notEqual(getTableName(matches), getTableName(commentary));
  });

  it('matches and commentary each have their own createdAt column', () => {
    const matchCols = getTableColumns(matches);
    const commentaryCols = getTableColumns(commentary);
    assert.ok('createdAt' in matchCols);
    assert.ok('createdAt' in commentaryCols);
  });

  it('matches exports are all defined (no undefined exports)', () => {
    assert.ok(matchStatusEnum !== undefined);
    assert.ok(matches !== undefined);
    assert.ok(commentary !== undefined);
  });

  it('nullable columns in matches are only startTime and endTime', () => {
    const cols = getTableColumns(matches);
    const nullableCols = Object.entries(cols)
      .filter(([, col]) => !col.notNull)
      .map(([key]) => key);
    assert.deepEqual(nullableCols.sort(), ['endTime', 'startTime']);
  });

  it('nullable columns in commentary are actor, team, metadata, and tags', () => {
    const cols = getTableColumns(commentary);
    const nullableCols = Object.entries(cols)
      .filter(([, col]) => !col.notNull)
      .map(([key]) => key);
    assert.deepEqual(nullableCols.sort(), ['actor', 'metadata', 'tags', 'team']);
  });

  // regression: scores should never have negative defaults
  it('score columns default to a non-negative value', () => {
    const cols = getTableColumns(matches);
    assert.ok(cols.homeScore.default >= 0);
    assert.ok(cols.awayScore.default >= 0);
  });

  // boundary: varchar lengths are within reasonable sport domain bounds
  it('period varchar length (50) is sufficient for period names', () => {
    const cols = getTableColumns(commentary);
    assert.ok(cols.period.config.length >= 10);
  });

  it('eventType varchar length (100) is sufficient for event type names', () => {
    const cols = getTableColumns(commentary);
    assert.ok(cols.eventType.config.length >= 50);
  });
});
