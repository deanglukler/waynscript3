import SqlString from 'sqlstring-sqlite';

import { Directory } from '../types';
import db from './db';
import { logQuery, runQuery } from './utils';

export const getDirectories = () => {
  const sql = `SELECT * FROM directories;`;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.all();
  return res as Directory[];
};

export const addDirectory = (dirPath: string) => {
  const sql = SqlString.format(
    'INSERT INTO directories (path, active) VALUES (?, TRUE)',
    [dirPath]
  );
  return runQuery(sql);
};

export const removeDirectory = (dirPath: string) => {
  const sql = SqlString.format('DELETE FROM directories WHERE path = ?', [
    dirPath,
  ]);
  return runQuery(sql);
};

export const activateDir = (dirPath: string) => {
  const sql = SqlString.format(
    'UPDATE directories SET active=TRUE WHERE path = ?',
    [dirPath]
  );
  return runQuery(sql);
};

export const deActivateDir = (dirPath: string) => {
  const sql = SqlString.format(
    'UPDATE directories SET active=FALSE WHERE path = ?',
    [dirPath]
  );
  return runQuery(sql);
};
