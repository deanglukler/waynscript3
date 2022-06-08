import { ipcMain } from 'electron';
import { addQuery, getLastQuery } from '../db/queries';
import { getSamplesByQuery } from '../db/samples';
import { Sample, Query } from '../types';
import { logMainOn } from './log';
import Windows from './Windows';

export class Queries {
  constructor(public windows: Windows) {
    ipcMain.on('QUERY_UPDATE', (event, arg: [Query]) => {
      logMainOn(arg, 'QUERY_UPDATE');
      const query = arg[0];

      addQuery(query);

      const files: Sample[] = getSamplesByQuery(query);
      windows.sendWindowMessage('listWindow', 'RECEIVE_FILES', files);
    });

    ipcMain.on('REQUEST_INIT_QUERY', (event, arg) => {
      logMainOn(arg, 'REQUEST_INIT_QUERY');
      const query = getLastQuery();
      event.reply('RECEIVE_QUERY', query);
    });
  }
}
