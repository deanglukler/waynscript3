import { BpmStats } from '../types';
import { getActiveDirectories } from './directories';
import { activeDirsWhereClause, allQuery } from './utils';

export const getBpmStats = (): BpmStats => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) {
    console.log('\nNO ACTIVE DIRS\n');
    return [];
  }

  const whereClause = activeDirsWhereClause(
    activeDirs,
    `samples.bpm IS NOT NULL`
  );

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
