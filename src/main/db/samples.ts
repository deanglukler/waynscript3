import SqlString from 'sqlstring-sqlite';
import { Sample } from '../types';
import { getActiveDirectories } from './directories';
import { getLastQuery } from './queries';
import { activeDirsWhereClause, allQuery, runQuery } from './utils';

export const wordsClause = (words: string[]) =>
  words.map((word) => SqlString.format(`words.word = ?`, [word])).join(' OR ');

export const insertSamples = (samples: Sample[]) => {
  const samplesSQL = samples.map((sample) => [
    sample.path,
    sample.bpm,
    sample.key,
    sample.dir_id,
  ]);
  const sql = SqlString.format(
    'INSERT INTO samples (path,bpm,key,dir_id) VALUES ?',
    [samplesSQL]
  );
  return runQuery(sql);
};

export const getAllSamples = () => {
  return allQuery<{ path: string }>(`SELECT path FROM samples`);
};

export const getSamplesInActiveDirs = () => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) {
    console.log('\nNO ACTIVE DIRS\n');
    return [];
  }

  const whereClause = activeDirsWhereClause(activeDirs, []);

  const fullClause = `SELECT path FROM samples WHERE ${whereClause}`;

  return allQuery<{ path: string }>(fullClause);
};

export const getSamplesByQuery = () => {
  const query = getLastQuery();
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) {
    console.log('\nNO ACTIVE DIRS\n');
    return [];
  }

  const { bpms, keys, words } = query;
  const bpmsClause = bpms
    .map((bpm) => SqlString.format(`samples.bpm = ?`, [bpm]))
    .join(' OR ');
  const keysClause = keys
    .map((key) => SqlString.format(`samples.key = ?`, [key]))
    .join(' OR ');

  const whereClause = activeDirsWhereClause(activeDirs, [
    bpmsClause,
    keysClause,
    wordsClause(words),
  ]);

  let fullClause = `SELECT DISTINCT
  samples.path as path,
  samples.bpm as bpm,
  samples.key as key
  FROM samples`;

  if (wordsClause(words)) {
    fullClause = `${fullClause} JOIN words ON words.path = samples.path`;
  }

  if (whereClause) {
    fullClause = `${fullClause} WHERE ${whereClause}`;
  }

  fullClause = `${fullClause} ORDER BY RANDOM() LIMIT 50;`;

  return allQuery<Sample>(fullClause);
};

export const deleteSamples = (paths: string[]) => {
  if (paths.length === 0) return;
  const samplesWordsSQL = SqlString.format(
    `DELETE FROM samples_words WHERE path IN ( ? )`,
    [paths]
  );
  runQuery(samplesWordsSQL);
  const samplesSQL = SqlString.format(
    `DELETE FROM samples WHERE path IN ( ? )`,
    [paths]
  );
  runQuery(samplesSQL);
};
