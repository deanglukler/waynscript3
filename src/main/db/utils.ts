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
  // // samples
  // runQuery(`DROP TABLE IF EXISTS samples;`);
  // const samplesSQL = `CREATE TABLE "samples" (
  //   "id"	INTEGER NOT NULL UNIQUE,
  //   "path"	TEXT NOT NULL,
  //   PRIMARY KEY("id" AUTOINCREMENT)
  //   UNIQUE(path) ON CONFLICT REPLACE
  // );`;
  // runQuery(samplesSQL);

  // // directories
  // runQuery(`DROP TABLE IF EXISTS directories;`);
  // const dirsSQL = `CREATE TABLE "directories" (
  //   "id"	INTEGER NOT NULL UNIQUE,
  //   "path"	TEXT NOT NULL,
  //   "active"	INTEGER NOT NULL,
  //   PRIMARY KEY("id" AUTOINCREMENT)
  // );`;
  // runQuery(dirsSQL);

  // windows
  runQuery(`DROP TABLE IF EXISTS windows;`);
  const windowsSQL = `CREATE TABLE "windows" (
    "id"	INTEGER NOT NULL UNIQUE,
    "name"	TEXT NOT NULL UNIQUE,
    "width"	INTEGER NOT NULL,
    "height"	INTEGER NOT NULL,
    "x"	INTEGER,
    "y"	INTEGER,
    PRIMARY KEY("id" AUTOINCREMENT)
  );`;
  runQuery(windowsSQL);
  runQuery(
    `INSERT INTO windows (name,width,height) VALUES ('queryWindow',900,700);`
  );
  runQuery(
    `INSERT INTO windows (name,width,height) VALUES ('listWindow',400,700);`
  );
};
