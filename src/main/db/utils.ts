import SqlString from 'sqlstring-sqlite';
import { Directory, Query } from '../types';
import db from './db';

let timeLogID = 0;

export const logQuery = (q: string) => {
  console.log(`\nSQL:`);
  console.log(`${q}`);
  console.time(`sql time${timeLogID}`);
};

const logQueryTime = () => {
  console.timeEnd(`sql time${timeLogID}`);
  timeLogID++;
};

export const runQuery = (q: string, cancelLog?: boolean) => {
  const sql = q;
  if (!cancelLog) logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.run();
  if (!cancelLog) logQueryTime();
  return res;
};

export const getQuery = <T>(q: string) => {
  const sql = q;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.get();
  logQueryTime();
  return res as T;
};

export const allQuery = <T>(q: string) => {
  const sql = q;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.all();
  logQueryTime();
  return res as T[];
};

export const activeDirsWhereClause = (
  activeDirs: Directory[],
  andClauses: string[]
): string => {
  return activeDirs
    .map((dir) => {
      let pathClause = `samples.path LIKE ${SqlString.escape(`%${dir.path}%`)}`;
      if (andClauses.length > 0) {
        andClauses.forEach((sql) => {
          if (!sql) return;
          pathClause = `${pathClause} AND (${sql})`;
        });
      }
      pathClause = `(${pathClause})`;
      return pathClause;
    })
    .join(' OR ');
};

export const initQuery: Query = { bpms: [], keys: [], words: [] };

export const cleanDatabase = () => {
  // clean duplicate samples_words
  runQuery(`DELETE FROM samples_words
  WHERE EXISTS (
    SELECT 1 FROM samples_words sw
    WHERE samples_words.path = sw.path
    AND samples_words.word = sw.word
    AND samples_words.id > sw.id
  );`);
};

export const resetDatabase = () => {
  // directories
  runQuery(`DROP TABLE IF EXISTS directory_childs`);
  runQuery(`DROP TABLE IF EXISTS samples;`);
  runQuery(`DROP TABLE IF EXISTS directories;`);
  const createDirs = `CREATE TABLE "directories" (
     "id"	INTEGER NOT NULL UNIQUE,
     "path"	TEXT NOT NULL,
     "active" INTEGER NOT NULL,
     "viewing"	INTEGER NOT NULL,
     "top_level"	INTEGER NOT NULL,
     "last_child" INTEGER,
     "total_samples" INTEGER,
     PRIMARY KEY("id" AUTOINCREMENT),
     UNIQUE("path") ON CONFLICT IGNORE
   );`;
  runQuery(createDirs);

  const createDirChilds = `CREATE TABLE "directory_childs" (
    "id"	INTEGER NOT NULL REFERENCES directories("id"),
    "child_id"	INTEGER NOT NULL UNIQUE REFERENCES directories("id"),
    PRIMARY KEY("child_id")
  );`;
  runQuery(createDirChilds);

  // samples
  const createSamples = `CREATE TABLE "samples" (
    "path"	TEXT NOT NULL,
    "bpm"	INTEGER,
    "key"	TEXT,
    "dir_id" INTEGER NOT NULL REFERENCES directories("id"),
    PRIMARY KEY("path"),
    UNIQUE("path") ON CONFLICT IGNORE
  );`;
  runQuery(createSamples);
  const samplesIndex = `CREATE INDEX IF NOT EXISTS "" ON "samples" (
    "path"
  );`;
  runQuery(samplesIndex);

  // queries
  runQuery(`DROP TABLE IF EXISTS queries;`);
  const createQueries = `CREATE TABLE "queries" (
    "id"	INTEGER NOT NULL UNIQUE,
    "query"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  );`;
  runQuery(createQueries);

  runQuery(
    SqlString.format(`INSERT INTO queries (query) VALUES ( ? )`, [
      JSON.stringify(initQuery),
    ])
  );

  // words
  runQuery(`DROP TABLE IF EXISTS words;`);
  const createWords = `CREATE TABLE "words" (
    "word"	TEXT NOT NULL UNIQUE,
    "favorite "	INTEGER,
    PRIMARY KEY("word"),
    UNIQUE("word") ON CONFLICT IGNORE
  );`;
  runQuery(createWords);
  const wordsIndex = `CREATE INDEX IF NOT EXISTS "" ON "words" (
    "word"
  );`;
  runQuery(wordsIndex);

  // // windows
  // runQuery(`DROP TABLE IF EXISTS windows;`);
  // const windowsSQL = `CREATE TABLE "windows" (
  //   "id"	INTEGER NOT NULL UNIQUE,
  //   "name"	TEXT NOT NULL UNIQUE,
  //   "width"	INTEGER NOT NULL,
  //   "height"	INTEGER NOT NULL,
  //   "x"	INTEGER,
  //   "y"	INTEGER,
  //   PRIMARY KEY("id" AUTOINCREMENT)
  // );`;
  // runQuery(windowsSQL);
  // runQuery(
  //   `INSERT INTO windows (name,width,height) VALUES ('queryWindow',900,700);`
  // );
  // runQuery(
  //   `INSERT INTO windows (name,width,height) VALUES ('listWindow',400,700);`
  // );
};
