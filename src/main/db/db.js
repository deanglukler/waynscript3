import SQLite from 'better-sqlite3-with-prebuilds';
import getAssetPath from '../utils/getAssetPath';

const db = new SQLite(getAssetPath('database.dev.db'));

export default db;
