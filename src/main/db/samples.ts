import SqlString from 'sqlstring-sqlite';
import { Sample } from '../../types';
import { SqlGen } from '../utils/SqlGen';
import { allQuery, runQuery } from './utils';

export const dropSamplesSQL = `DROP TABLE IF EXISTS samples;`;

export const createSamplesSQL = `CREATE TABLE "samples" (
  "path"	TEXT NOT NULL,
  "bpm"	INTEGER,
  "key"	TEXT,
  "dir_id" INTEGER NOT NULL REFERENCES directories("id"),
  PRIMARY KEY("path"),
  UNIQUE("path") ON CONFLICT IGNORE
);`;

export const wordsWhereClause = (words: string[]) =>
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
  return runQuery(sql, true);
};

export const getAllSamples = () => {
  return allQuery<{ path: string }>(`SELECT path FROM samples`);
};

export const getSamplesInActiveDirs = () => {
  const sqlGen = new SqlGen();
  const sql = `
  ${sqlGen.selectFromSamples(['path'])}
  ${sqlGen.whereFiltering(['sample-paths-like-active-dirs'])}
  `;

  return allQuery<{ path: string }>(sql);
};

export const getSamplesByQuery = () => {
  const sqlGen = new SqlGen();
  if (sqlGen.activeDirectories.length === 0) {
    console.log('\nNO ACTIVE DIRS\n');
    return [];
  }

  const sql = `${sqlGen.selectDistinctFromSamples([
    'samples.path as path',
    'samples.bpm as bpm',
    'samples.key as key',
  ])}
  ${sqlGen.joinWordsToSamplesIfAnyWords()}
  ${sqlGen.joinTagsToSamplesIfAnyTags()}
  ${sqlGen.whereFiltering([
    'bpms',
    'keys',
    'words',
    'tags',
    'sample-paths-like-active-dirs',
  ])}
  ${sqlGen.limit(50)}`;

  return allQuery<Sample>(sql);
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

export const dropSamplesTable = () => {
  runQuery(dropSamplesSQL);
};

export const createSamplesTable = () => {
  runQuery(createSamplesSQL);
};
