import { ipcMain } from 'electron';
import { getSamplesByQuery } from '../db/samples';
import { Query, Sample } from '../types';
import getAssetPath from './getAssetPath';
import { logMainOn } from './log';
import Windows from './Windows';

export default class Samples {
  static initIPC() {
    ipcMain.on('FILE_DRAG', (event, arg) => {
      logMainOn(arg, 'FILE_DRAG');
      const file = arg[0] as string;
      event.sender.startDrag({
        file,
        icon: getAssetPath('music-icon-sm.png'),
      });
    });
  }

  static getSamplesAndSendToList(windows: Windows, query: Query) {
    console.log('\nStarting get samples and send to list . . . . .');
    const files: Sample[] = getSamplesByQuery(query);
    windows.sendWindowMessage('listWindow', 'RECEIVE_FILES', files);
  }
}
