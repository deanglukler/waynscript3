import { ipcMain } from 'electron';
import { getSamplesByQuery } from '../db/samples';
import { Sample } from '../../types';
import getAssetPath from './getAssetPath';
import { logMainOn } from './log';
import Windows from './Windows';

export default class Samples {
  static initIPC(windows: Windows, refreshSampleList: () => void) {
    ipcMain.on('DRAG_FILEPATHS', (event, arg) => {
      logMainOn(arg, 'DRAG_FILEPATHS');
      const files = arg[0] as string[];
      // the following seems to work well despite typescript..
      event.sender.startDrag({
        files,
        icon: getAssetPath('music-icon-sm.png'),
      });
    });

    ipcMain.on('SYNC_SAMPLES', () => {
      refreshSampleList();
    });
  }

  static getSamplesAndSendToList(windows: Windows) {
    console.log('\nStarting get samples and send to list . . . . .');
    const files: Sample[] = getSamplesByQuery();
    windows.sendWindowMessage('listWindow', 'RECEIVE_SAMPLES', files);
  }
}
