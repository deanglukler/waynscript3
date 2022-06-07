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
