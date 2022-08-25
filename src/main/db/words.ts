import SqlString from 'sqlstring-sqlite';
import { Word } from '../../types';
import { createWordsSQL, dropWordsSQL } from './reset';
import { runQuery } from './utils';

export const insertWords = (words: Word[]) => {
  const wordsSQL = words.map((wordPath) => [wordPath.word, wordPath.path]);
  const sql = SqlString.format('INSERT INTO words (word, path) VALUES ?', [
    wordsSQL,
  ]);
  return runQuery(sql, true);
};

export const dropWordsTable = () => {
  runQuery(dropWordsSQL);
};

export const createWordsTable = () => {
  runQuery(createWordsSQL);
};
