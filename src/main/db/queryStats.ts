import SqlString from 'sqlstring-sqlite';
import { BpmStats, KeyStats } from '../types';
import { getActiveDirectories } from './directories';
import { getLastQuery } from './queries';
import { activeDirsWhereClause, allQuery } from './utils';

export const getBpmStats = (): BpmStats => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) {
    console.log('\nNO ACTIVE DIRS\n');
    return {};
  }

  const { keys } = getLastQuery();
  const keysClause = keys
    .map((key) => SqlString.format(`samples.key = ?`, [key]))
    .join(' OR ');

  const whereClause = activeDirsWhereClause(activeDirs, [
    `samples.bpm IS NOT NULL`,
    keysClause,
  ]);

  const sql = `SELECT samples.bpm FROM samples WHERE ${whereClause}`;

  const res = allQuery<{ bpm: number }>(sql);
  const bpmStats: BpmStats = {};
  return res.reduce((stats, next) => {
    if (!stats[next.bpm]) {
      stats[next.bpm] = { amount: 0 };
    }
    stats[next.bpm].amount++;
    return stats;
  }, bpmStats);
};

export const getKeyStats = (): KeyStats => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) {
    console.log('\nNO ACTIVE DIRS\n');
    return {};
  }

  const { bpms } = getLastQuery();
  const bpmsClause = bpms
    .map((bpm) => SqlString.format(`samples.bpm = ?`, [bpm]))
    .join(' OR ');

  const whereClause = activeDirsWhereClause(activeDirs, [
    `samples.key IS NOT NULL`,
    bpmsClause,
  ]);

  const sql = `SELECT samples.key FROM samples WHERE ${whereClause}`;

  const res = allQuery<{ key: string }>(sql);
  const keyStats: KeyStats = {};
  return res.reduce((stats, next) => {
    if (!stats[next.key]) {
      stats[next.key] = { amount: 0 };
    }
    stats[next.key].amount++;
    return stats;
  }, keyStats);
};
