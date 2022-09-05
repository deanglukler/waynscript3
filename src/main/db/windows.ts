import SqlString from 'sqlstring-sqlite';
import { WindowInfo } from '../../types';
import { getQuery, logQuery, runQuery } from './utils';

export const dropWindowsSQL = `DROP TABLE IF EXISTS windows;`;

export const createWindowsSQL = `CREATE TABLE "windows" (
  "id"	INTEGER NOT NULL UNIQUE,
  "name"	TEXT NOT NULL UNIQUE,
  "width"	INTEGER NOT NULL,
  "height"	INTEGER NOT NULL,
  "x"	INTEGER,
  "y"	INTEGER,
  PRIMARY KEY("id" AUTOINCREMENT)
);`;

export const getMainWindow = () => {
  const sql = `SELECT * FROM windows WHERE windows.name = 'main';`;
  logQuery(sql);
  const res = getQuery(sql);
  return res as WindowInfo;
};

export const updateWindow = (win: WindowInfo) => {
  if (!win.name) {
    throw new Error('why no window name');
  }

  const { width, height, x, y, name } = win;

  const sql = SqlString.format(
    'UPDATE windows SET width=?, height=?, x=?, y=? WHERE name = ?',
    [width, height, x, y, name]
  );
  return runQuery(sql);
};
