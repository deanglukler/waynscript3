import { ipcMain } from 'electron';
import { resetDatabase } from '../db/utils';
import { logMainOn } from './log';

export default class Database {
  static resetDatabase() {
    resetDatabase();
  }

  constructor() {
    ipcMain.on('RESET_DB', (event, arg) => {
      logMainOn(arg, 'RESET_DB');
      Database.resetDatabase();
    });
  }
}
