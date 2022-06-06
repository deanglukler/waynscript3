import SQLite from 'better-sqlite3-with-prebuilds';
import getAssetPath from '../utils/getAssetPath';

const db = new SQLite(getAssetPath('database.dev.db'));

export const logQuery = (q) => {
  console.log(`\nSQL Query:`);
  console.log(`${q}\n`);
};

export default db;
