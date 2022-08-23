import SqlString from 'sqlstring-sqlite';
import { WindowInfo } from '../../shared/types';
import db from './db';
import { logQuery, runQuery } from './utils';

export const getQueryWindow = () => {
  const sql = `SELECT * FROM windows WHERE windows.name = 'queryWindow';`;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.get();
  return res as WindowInfo;
};

export const getListWindow = () => {
  const sql = `SELECT * FROM windows WHERE windows.name = 'listWindow';`;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.get();
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
