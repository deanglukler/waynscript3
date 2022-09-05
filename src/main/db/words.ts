import SqlString from 'sqlstring-sqlite';
import { Word } from '../../types';
import { runQuery } from './utils';

export const dropWordsSQL = `DROP TABLE IF EXISTS words;`;

export const createWordsSQL = `CREATE TABLE "words" (
  "id"	INTEGER NOT NULL UNIQUE,
  "word"	TEXT NOT NULL,
  "path"	TEXT NOT NULL REFERENCES samples("path"),
  PRIMARY KEY("id" AUTOINCREMENT)
);`;

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
