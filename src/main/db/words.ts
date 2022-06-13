import SqlString from 'sqlstring-sqlite';
import { SampleAnalysis } from '../types';
import { runQuery } from './utils';

export const insertWordsAndSamples = (samples: SampleAnalysis[]): void => {
  const wordsSQL: [string][] = [];
  samples.forEach((sample) => {
    sample.words.forEach(({ word }) => {
      wordsSQL.push([word]);
    });
  });
  const wordsFormatSQL = SqlString.format('INSERT INTO words (word) VALUES ?', [
    wordsSQL,
  ]);
  runQuery(wordsFormatSQL);

  const samplesWordsSQL: [string, string][] = [];
  samples.forEach((sample) => {
    sample.words.forEach(({ sampleWord }) => {
      samplesWordsSQL.push([sampleWord.word, sampleWord.path]);
    });
  });
  const samplesWordsFormatSQL = SqlString.format(
    'INSERT INTO samples_words (word, path) VALUES ?',
    [samplesWordsSQL]
  );
  runQuery(samplesWordsFormatSQL);
};
