import _ from 'lodash';
import SqlString from 'sqlstring-sqlite';
import { Stats } from '../types';

import { getActiveDirectories } from './directories';
import { getLastQuery } from './queries';
import { wordsClause } from './samples';
import { activeDirsWhereClause, allQuery } from './utils';

export const getBpmStats = (): Stats => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) return {};

  const { keys, words } = getLastQuery();
  const keysClause = keys
    .map((key) => SqlString.format(`samples.key = ?`, [key]))
    .join(' OR ');

  const whereClause = activeDirsWhereClause(activeDirs, [
    `samples.bpm IS NOT NULL`,
    keysClause,
    wordsClause(words),
  ]);

  let sql = `SELECT samples.bpm FROM samples`;
  if (wordsClause(words)) {
    sql = `${sql} JOIN words ON words.path = samples.path`;
  }

  sql = `${sql} WHERE ${whereClause}`;

  const res = allQuery<{ bpm: number }>(sql);
  const bpmStats: Stats = {};
  return res.reduce((stats, next) => {
    if (!stats[next.bpm]) {
      stats[next.bpm] = { amount: 0 };
    }
    stats[next.bpm].amount++;
    return stats;
  }, bpmStats);
};

export const getKeyStats = (): Stats => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) return {};

  const { bpms, words } = getLastQuery();
  const bpmsClause = bpms
    .map((bpm) => SqlString.format(`samples.bpm = ?`, [bpm]))
    .join(' OR ');

  const whereClause = activeDirsWhereClause(activeDirs, [
    `samples.key IS NOT NULL`,
    bpmsClause,
    wordsClause(words),
  ]);

  let sql = `SELECT samples.key FROM samples`;
  if (wordsClause(words)) {
    sql = `${sql} JOIN words ON words.path = samples.path`;
  }

  sql = `${sql} WHERE ${whereClause}`;

  const res = allQuery<{ key: string }>(sql);
  const keyStats: Stats = {};
  return res.reduce((stats, next) => {
    if (!stats[next.key]) {
      stats[next.key] = { amount: 0 };
    }
    stats[next.key].amount++;
    return stats;
  }, keyStats);
};

export const getWordStats = async (): Promise<Stats> => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) return {};

  const { bpms, keys } = getLastQuery();
  const bpmsClause = bpms
    .map((bpm) => SqlString.format(`samples.bpm = ?`, [bpm]))
    .join(' OR ');
  const keysClause = keys
    .map((key) => SqlString.format(`samples.key = ?`, [key]))
    .join(' OR ');

  const whereClause = activeDirsWhereClause(activeDirs, [
    keysClause,
    bpmsClause,
  ]);
  const sql = `SELECT words.word FROM samples
  JOIN words ON words.path = samples.path
  WHERE ${whereClause}`;

  const results = allQuery<{ word: string }>(sql);

  const wordStats: Stats = {};

  results.forEach(({ word }) => {
    _.defaults(wordStats, { [word]: { amount: 0 } });
    wordStats[word].amount++;
  });

  const amountValues = _.values(wordStats).map(({ amount }) => amount);
  const average = _.mean(amountValues);
  const standardDeviation = Math.sqrt(
    _.sum(_.map(amountValues, (i) => (i - average) ** 2)) / amountValues.length
  );

  console.log('\n(ALL) Word Stats..');
  console.log(`TOTAL: ${amountValues.length}`);
  console.log(`AVERAGE: ${average}`);
  console.log(`STANDARD DEVIATION: ${standardDeviation}`);
  console.log('');

  const filteredWordStats: Stats = {};
  Object.entries(wordStats).forEach(([key, val]) => {
    const { amount } = val;
    if (amount > average) {
      filteredWordStats[key] = val;
    }
  });

  return filteredWordStats;
};
