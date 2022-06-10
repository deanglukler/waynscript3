import { ipcMain } from 'electron';
import { addQuery, getLastQuery } from '../db/queries';
import { Query } from '../types';
import { logMainOn } from './log';
import Windows from './Windows';

export default class Queries {
  static initIPC(
    windows: Windows,
    refreshSampleList: () => void,
    refreshQueryStats: () => void
  ) {
    ipcMain.on('SYNC_QUERY', (event, arg: [Query]) => {
      logMainOn(arg, 'SYNC_QUERY');
      const query = arg[0];

      addQuery(query);
      refreshSampleList();
      refreshQueryStats();
    });

    ipcMain.on('INIT_QUERY_PARAMS', (event, arg) => {
      logMainOn(arg, 'INIT_QUERY_PARAMS');
      const query = getLastQuery();
      windows.sendWindowMessage('queryWindow', 'RECEIVE_QUERY', query);
      windows.sendWindowMessage(
        'queryWindow',
        'INITIALIZED_QUERY_PARAMS',
        null
      );
    });
  }
}
