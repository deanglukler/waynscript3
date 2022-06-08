import { ipcMain } from 'electron';
import { addQuery, getLastQuery } from '../db/queries';
import { Query } from '../types';
import { logMainOn } from './log';

export class Queries {
  constructor() {
    ipcMain.on('QUERY_UPDATE', (event, arg: [Query]) => {
      logMainOn(arg, 'QUERY_UPDATE');
      addQuery(arg[0]);
    });
    ipcMain.on('REQUEST_INIT_QUERY', (event, arg) => {
      logMainOn(arg, 'REQUEST_INIT_QUERY');
      const query = getLastQuery();
      event.reply('RECEIVE_QUERY', query);
    });
  }
}
