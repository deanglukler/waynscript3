import { Directory } from '../types';
import db, { logQuery } from './db';

export const getDirectories = () => {
  const sql = `SELECT * FROM directories;`;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.all();
  return res as Directory[];
};

export const addDirectory = (dirPath: string) => {
  const sql = `INSERT INTO directories (path, active) VALUES ('${dirPath}', TRUE);`;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.run();
  return res;
};

export const removeDirectory = (dirPath: string) => {
  const sql = `DELETE FROM directories WHERE path = '${dirPath}';`;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.run();
  return res;
};
