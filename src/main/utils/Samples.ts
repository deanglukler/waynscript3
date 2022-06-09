import { ipcMain } from 'electron';
import getAssetPath from './getAssetPath';
import { logMainOn } from './log';

export default class Samples {
  constructor() {
    ipcMain.on('FILE_DRAG', (event, arg) => {
      logMainOn(arg, 'FILE_DRAG');
      const file = arg[0] as string;
      event.sender.startDrag({
        file,
        icon: getAssetPath('music-icon-sm.png'),
      });
    });
  }
}
