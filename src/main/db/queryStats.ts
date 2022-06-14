import _ from 'lodash';
import SqlString from 'sqlstring-sqlite';

import { BpmStats, KeyStats, WordStats } from '../types';
import { getActiveDirectories } from './directories';
import { getLastQuery } from './queries';
import { activeDirsWhereClause, allQuery } from './utils';

export const getBpmStats = (): BpmStats => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) return {};

  const { keys, words } = getLastQuery();
  const keysClause = keys
    .map((key) => SqlString.format(`samples.key = ?`, [key]))
    .join(' OR ');
  const wordsClause = words
    .map((word) => SqlString.format(`samples_words.word = ?`, [word]))
    .join(' OR ');

  const whereClause = activeDirsWhereClause(activeDirs, [
    `samples.bpm IS NOT NULL`,
    keysClause,
    wordsClause,
  ]);

  let sql = `SELECT samples.bpm FROM samples`;

  if (wordsClause) {
    sql = `${sql} JOIN samples_words ON samples.path = samples_words.path`;
  }

  sql = `${sql} WHERE ${whereClause}`;

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
  if (activeDirs.length === 0) return {};

  const { bpms, words } = getLastQuery();
  const bpmsClause = bpms
    .map((bpm) => SqlString.format(`samples.bpm = ?`, [bpm]))
    .join(' OR ');
  const wordsClause = words
    .map((word) => SqlString.format(`samples_words.word = ?`, [word]))
    .join(' OR ');

  const whereClause = activeDirsWhereClause(activeDirs, [
    `samples.key IS NOT NULL`,
    bpmsClause,
    wordsClause,
  ]);

  let sql = `SELECT samples.bpm FROM samples`;

  if (wordsClause) {
    sql = `${sql} JOIN samples_words ON samples.path = samples_words.path`;
  }

  sql = `${sql} WHERE ${whereClause}`;

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

export const getWordStats = (): WordStats => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) return {};

  const { bpms, keys } = getLastQuery();
  const bpmsClause = bpms
    .map((bpm) => SqlString.format(`samples.bpm = ?`, [bpm]))
    .join(' OR ');
  const keysClause = keys
    .map((key) => SqlString.format(`samples.key = ?`, [key]))
    .join(' OR ');

  const samplesWhereSQL = activeDirsWhereClause(activeDirs, [
    keysClause,
    bpmsClause,
  ]);
  const sql = `SELECT DISTINCT samples_words.word as word, COUNT(samples_words.word) as amount
  FROM samples
  JOIN samples_words ON samples.path = samples_words.path
  WHERE ${samplesWhereSQL}
  GROUP BY samples_words.word`;

  const results = allQuery<{ word: string; amount: number }>(sql);

  const amountValues = results.map(({ amount }) => amount);
  const average = _.mean(amountValues);
  const standardDeviation = Math.sqrt(
    _.sum(_.map(amountValues, (i) => (i - average) ** 2)) / amountValues.length
  );

  console.log('\n(ALL) Word Stats..');
  console.log(`TOTAL: ${amountValues.length}`);
  console.log(`AVERAGE: ${average}`);
  console.log(`STANDARD DEVIATION: ${standardDeviation}`);
  console.log('');

  const filteredWordStats: WordStats = {};
  results.forEach((result) => {
    const { amount } = result;
    if (amount > average) {
      filteredWordStats[result.word] = {
        amount,
      };
    }
  });

  return filteredWordStats;
};
