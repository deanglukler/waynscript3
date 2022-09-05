import { Connection } from './Connection';

let timeLogID = 0;

export const logQuery = (q: string) => {
  console.log(`\nSQL:`);
  console.log(`${q}`);
  console.time(`sql time${timeLogID}`);
};

const logQueryTime = () => {
  console.timeEnd(`sql time${timeLogID}`);
  timeLogID++;
};

export const runQuery = (q: string, cancelLog?: boolean) => {
  const sql = q;
  if (!cancelLog) logQuery(sql);
  const { db } = new Connection();
  const stmt = db.prepare(sql);
  const res = stmt.run();
  if (!cancelLog) logQueryTime();
  db.close();
  return res;
};

export const getQuery = <T>(q: string) => {
  const sql = q;
  logQuery(sql);
  const { db } = new Connection();
  const stmt = db.prepare(sql);
  const res = stmt.get();
  logQueryTime();
  db.close();
  return res as T;
};

export const allQuery = <T>(q: string) => {
  const sql = q;
  logQuery(sql);
  const { db } = new Connection();
  const stmt = db.prepare(sql);
  const res = stmt.all();
  logQueryTime();
  db.close();
  return res as T[];
};
