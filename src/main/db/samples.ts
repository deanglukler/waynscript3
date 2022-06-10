import SqlString from 'sqlstring-sqlite';
import { Sample, Query } from '../types';
import { getActiveDirectories } from './directories';
import { activeDirsWhereClause, allQuery, runQuery } from './utils';

export const insertSamples = (samples: Sample[]) => {
  const samplesSQL = samples.map((sample) => [
    sample.path,
    sample.bpm,
    sample.key,
  ]);
  const sql = SqlString.format('INSERT INTO samples (path,bpm,key) VALUES ?', [
    samplesSQL,
  ]);
  return runQuery(sql);
};

export const getSamplesByQuery = (query: Query) => {
  const activeDirs = getActiveDirectories();
  if (activeDirs.length === 0) {
    console.log('\nNO ACTIVE DIRS\n');
    return [];
  }

  const { bpms, keys } = query;
  const bpmsClause = bpms
    .map((bpm) => SqlString.format(`samples.bpm = ?`, [bpm]))
    .join(' OR ');
  const keysClause = keys
    .map((key) => SqlString.format(`samples.key = ?`, [key]))
    .join(' OR ');

  const whereClause = activeDirsWhereClause(activeDirs, [
    bpmsClause,
    keysClause,
  ]);

  let fullClause = 'SELECT * FROM samples';
  if (whereClause) {
    fullClause = `${fullClause} WHERE ${whereClause}`;
  }
  fullClause = `${fullClause} ORDER BY RANDOM() LIMIT 50;`;

  return allQuery<Sample>(fullClause);
};
