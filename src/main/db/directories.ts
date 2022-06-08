import SqlString from 'sqlstring-sqlite';

import { Directory } from '../types';
import { allQuery, runQuery } from './utils';

export const getDirectories = () =>
  allQuery<Directory>(`SELECT * FROM directories;`);

export const getActiveDirectories = () =>
  allQuery<Directory>(`SELECT * FROM directories WHERE active=TRUE`);

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
