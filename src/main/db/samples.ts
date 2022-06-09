import SqlString from 'sqlstring-sqlite';
import { Sample, Query } from '../types';
import { getActiveDirectories } from './directories';
import { allQuery, runQuery } from './utils';

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
  const { bpms } = query;
  let bpmsClause = '';
  bpmsClause = bpms.map((bpm) => `samples.bpm = ${bpm}`).join(' OR ');

  const activeDirs = getActiveDirectories();

  if (activeDirs.length === 0) {
    console.log('\nNO ACTIVE DIRS ie. No Samples\n');
    return [];
  }

  const whereClause = activeDirs
    .map((dir) => {
      let pathClause = `samples.path LIKE ${SqlString.escape(`%${dir.path}%`)}`;
      if (bpmsClause) {
        pathClause = `${pathClause} AND (${bpmsClause})`;
      }
      pathClause = `(${pathClause})`;
      return pathClause;
    })
    .join(' OR ');

  let fullClause = 'SELECT * FROM samples';
  if (whereClause) {
    fullClause = `${fullClause} WHERE ${whereClause}`;
  }
  fullClause = `${fullClause} ORDER BY RANDOM() LIMIT 50;`;

  return allQuery<Sample>(fullClause);
};
