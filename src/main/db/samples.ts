import SqlString from 'sqlstring-sqlite';
import { AnalyzedFile } from '../types';
import { runQuery } from './utils';

export const insertSamples = (samples: AnalyzedFile[]) => {
  const samplesSQL = samples.map((sample) => [sample.path]);
  const sql = SqlString.format('INSERT INTO samples (path) VALUES ?', [
    samplesSQL,
  ]);
  return runQuery(sql);
};
