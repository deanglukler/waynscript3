import { ipcMain } from 'electron';
import { addQuery, getLastQuery } from '../db/queries';
import { Query } from '../types';
import { logMainOn } from './log';
import Windows from './Windows';

export default class Queries {
  static initIPC(windows: Windows, refreshSampleList: () => void) {
    ipcMain.on('QUERY_UPDATE', (event, arg: [Query]) => {
      logMainOn(arg, 'QUERY_UPDATE');
      const query = arg[0];

      addQuery(query);
      refreshSampleList();
    });

    ipcMain.on('REQUEST_INIT_QUERY', (event, arg) => {
      logMainOn(arg, 'REQUEST_INIT_QUERY');
      const query = getLastQuery();
      event.reply('RECEIVE_QUERY', query);
    });
  }

  static getLastQuery() {
    return getLastQuery();
  }
}
