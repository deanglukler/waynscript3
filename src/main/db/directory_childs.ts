import SqlString from 'sqlstring-sqlite';
import { runQuery } from './utils';

export const dropDirectoryChildsSQL = `DROP TABLE IF EXISTS directory_childs;`;
export const createDirChildsSQL = `CREATE TABLE "directory_childs" (
  "id"	INTEGER NOT NULL REFERENCES directories("id"),
  "child_id"	INTEGER NOT NULL UNIQUE REFERENCES directories("id"),
  PRIMARY KEY("child_id")
);`;

export const addDirectoryChilds = (values: [number, number][]) => {
  if (values.length === 0) return;
  const sql = SqlString.format(
    'INSERT INTO directory_childs (id, child_id) VALUES ?',
    [values]
  );
  runQuery(sql, true);
};

export const dropDirChildsTable = () => {
  runQuery(dropDirectoryChildsSQL);
};

export const createDirChildsTable = () => {
  runQuery(createDirChildsSQL);
};
