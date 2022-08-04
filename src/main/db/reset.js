import SqlString from 'sqlstring-sqlite';

export const resetDatabase = (db) => {
  console.log('\nRESETTING DATABASE');

  const runQuery = (q) => {
    const sql = q;
    const stmt = db.prepare(sql);
    const res = stmt.run();
    return res;
  };

  // directories
  runQuery(`DROP TABLE IF EXISTS directory_childs`);
  runQuery(`DROP TABLE IF EXISTS words;`);
  runQuery(`DROP TABLE IF EXISTS samples;`);
  runQuery(`DROP TABLE IF EXISTS directories;`);
  runQuery(`DROP TABLE IF EXISTS windows;`);
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
      JSON.stringify({ bpms: [], keys: [], words: [] }),
    ])
  );

  // words
  const createWords = `CREATE TABLE "words" (
    "id"	INTEGER NOT NULL UNIQUE,
    "word"	TEXT NOT NULL,
    "path"	TEXT NOT NULL REFERENCES samples("path"),
    PRIMARY KEY("id" AUTOINCREMENT)
  );`;
  runQuery(createWords);
  const wordsIndex = `CREATE INDEX IF NOT EXISTS "" ON "words" (
    "word"
  );`;
  runQuery(wordsIndex);

  // windows
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
