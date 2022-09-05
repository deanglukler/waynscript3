import SQLite from 'better-sqlite3-with-prebuilds';
import { DB_PATH } from '../shared/constants';

export class Connection {
  public db: any;

  constructor() {
    this.db = new SQLite(DB_PATH, { fileMustExist: true });
  }
}
