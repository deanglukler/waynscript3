import db from './db';
import { logQuery } from './utils';

export const insertSample = (path: string) => {
  const sql = `INSERT INTO samples (path) VALUES ('${path}');`;
  logQuery(sql);
  const stmt = db.prepare(sql);
  const res = stmt.run();
  return res;
};
