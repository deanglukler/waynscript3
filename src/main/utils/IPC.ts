/* eslint-disable no-console */
import { dialog, ipcMain } from 'electron';
import Directories from './Directories';

const logMainOn = (arg: string, ch: string) => {
  console.log(`\n*** ipcMain on: ${ch} ***`);
  console.log(arg);
  console.log('***\n');
};

export default class IPC {
  constructor(public dirs: Directories) {
    ipcMain.on('CHOOSE_DIR', (event, arg) => {
      logMainOn(arg, 'CHOOSE_DIR');
      const selectedPaths = dialog.showOpenDialogSync({
        properties: ['openDirectory', 'multiSelections'],
      });
      if (!selectedPaths) {
        throw new Error('Why no paths selected?');
      }
      const path = selectedPaths[0];

      this.dirs.addDirectory(path);
      this.dirs.replyToEventWithDirList(event);
    });

    ipcMain.on('REMOVE_DIR', (event, arg) => {
      logMainOn(arg, 'REMOVE_DIR');
      const path = arg[0];
      this.dirs.removeDirectory(path);
      this.dirs.replyToEventWithDirList(event);
    });

    ipcMain.on('SYNC_QUERY_VIEW', (event, arg) => {
      logMainOn(arg, 'SYNC_QUERY_VIEW');
      this.dirs.replyToEventWithDirList(event);
    });

    ipcMain.on('ACTIVATE_DIR', (event, arg) => {
      logMainOn(arg, 'ACTIVATE_DIR');
      const path = arg[0];
      this.dirs.activateDir(path);
      this.dirs.replyToEventWithDirList(event);
    });

    ipcMain.on('DEACTIVATE_DIR', (event, arg) => {
      logMainOn(arg, 'DEACTIVATE_DIR');
      const path = arg[0];
      this.dirs.deActivateDir(path);
      this.dirs.replyToEventWithDirList(event);
    });
  }
}
