import SqlString from 'sqlstring-sqlite';

export const dropDirectoryChildsSQL = `DROP TABLE IF EXISTS directory_childs`;
export const createDirChildsSQL = `CREATE TABLE "directory_childs" (
  "id"	INTEGER NOT NULL REFERENCES directories("id"),
  "child_id"	INTEGER NOT NULL UNIQUE REFERENCES directories("id"),
  PRIMARY KEY("child_id")
);`;
export const dropDirectoriesSQL = `DROP TABLE IF EXISTS directories;`;
export const createDirsSQL = `CREATE TABLE "directories" (
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

export const dropWordsSQL = `DROP TABLE IF EXISTS words;`;
export const dropTagsSQL = `DROP TABLE IF EXISTS tags;`;
export const dropSamplesSQL = `DROP TABLE IF EXISTS samples;`;
export const createSamplesSQL = `CREATE TABLE "samples" (
  "path"	TEXT NOT NULL,
  "bpm"	INTEGER,
  "key"	TEXT,
  "dir_id" INTEGER NOT NULL REFERENCES directories("id"),
  PRIMARY KEY("path"),
  UNIQUE("path") ON CONFLICT IGNORE
);`;
export const createWordsSQL = `CREATE TABLE "words" (
    "id"	INTEGER NOT NULL UNIQUE,
    "word"	TEXT NOT NULL,
    "path"	TEXT NOT NULL REFERENCES samples("path"),
    PRIMARY KEY("id" AUTOINCREMENT)
  );`;

export const createTagsSQL = `CREATE TABLE "tags" (
  "id" INTEGER NOT NULL UNIQUE,
  "tag" TEXT NOT NULL,
  "path" TEXT NOT NULL REFERENCES samples("path"),
  PRIMARY KEY("id" AUTOINCREMENT)
);`;

export const resetDatabase = (db) => {
  console.log('\nRESETTING DATABASE');

  const runQuery = (q) => {
    const sql = q;
    const stmt = db.prepare(sql);
    const res = stmt.run();
    return res;
  };

  // directories
  runQuery(dropDirectoryChildsSQL);
  runQuery(dropDirectoriesSQL);
  runQuery(dropWordsSQL);
  runQuery(dropTagsSQL);
  runQuery(dropSamplesSQL);
  runQuery(`DROP TABLE IF EXISTS windows;`);
  runQuery(createDirsSQL);
  runQuery(createDirChildsSQL);

  // samples
  runQuery(createSamplesSQL);
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
  runQuery(createWordsSQL);
  const wordsIndex = `CREATE INDEX IF NOT EXISTS "" ON "words" (
    "word"
  );`;
  runQuery(wordsIndex);

  // percussion
  runQuery(createTagsSQL);

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
