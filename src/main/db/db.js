import fs from 'fs';
import SQLite from 'better-sqlite3-with-prebuilds';
import { dbPath } from '../constants';
import { resetDatabase } from './reset';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

if (process.env.RESET_DB === 'true') {
  console.log('\nDELETING DATABASE');
  fs.unlinkSync(dbPath);
}

let db = null;
try {
  db = new SQLite(dbPath, { fileMustExist: true });
} catch (error) {
  console.log(
    '\nThere was an error connecting to the database, maybe because it was reset?'
  );
  console.log(error);
  db = new SQLite(dbPath);
  resetDatabase(db);
}

const exportDb = db;
export default exportDb;
