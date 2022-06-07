import db from './db';

export const logQuery = (q: string) => {
  console.log(`\nSQL Query:`);
  console.log(`${q}\n`);
};

export const runQuery = (q: string) => {
  const sql = q;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.run();
  return res;
};

export const resetDatabase = () => {
  // samples
  runQuery(`DROP TABLE IF EXISTS samples;`);
  let sql = `CREATE TABLE "samples" (
    "id"	INTEGER NOT NULL UNIQUE,
    "path"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
    UNIQUE(path) ON CONFLICT REPLACE
  );`;
  runQuery(sql);

  // directories
  // runQuery(`DROP TABLE IF EXISTS directories;`);
  // sql = `CREATE TABLE "directories" (
  //   "id"	INTEGER NOT NULL UNIQUE,
  //   "path"	TEXT NOT NULL,
  //   "active"	INTEGER NOT NULL,
  //   PRIMARY KEY("id" AUTOINCREMENT)
  // );`;
  // runQuery(sql);
};
