import { BpmStats, KeyStats } from '../types';
import { getActiveDirectories } from './directories';
import { activeDirsWhereClause, allQuery } from './utils';

export const getBpmStats = (): BpmStats => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) {
    console.log('\nNO ACTIVE DIRS\n');
    return {};
  }

  const whereClause = activeDirsWhereClause(activeDirs, [
    `samples.bpm IS NOT NULL`,
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

  const whereClause = activeDirsWhereClause(activeDirs, [
    `samples.key IS NOT NULL`,
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
