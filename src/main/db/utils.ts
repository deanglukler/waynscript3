import SqlString from 'sqlstring-sqlite';
import { Directory } from '../../shared/types';
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
      let pathClause = `samples.path LIKE ${SqlString.escape(`${dir.path}%`)}`;
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
