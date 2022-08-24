import fs from 'fs';
import SQLite from 'better-sqlite3-with-prebuilds';
import { DB_PATH } from '../shared/constants';
import { resetDatabase } from './reset';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

if (process.env.RESET_DB === 'true') {
  console.log('\nDELETING DATABASE');
  fs.unlinkSync(DB_PATH);
}

let db = null;
try {
  db = new SQLite(DB_PATH, { fileMustExist: true });
} catch (error) {
  console.log(
    '\nThere was an error connecting to the database, maybe because it was reset?'
  );
  console.log(error);
  db = new SQLite(DB_PATH);
  resetDatabase(db);
}

const exportDb = db;
export default exportDb;
