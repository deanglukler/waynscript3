/* eslint-disable no-console */
import { dialog, ipcMain } from 'electron';
import Directories from './Directories';

const logMainOn = (arg: string, ch: string) => {
  console.log(`\n*** ipcMain on: ${ch} ***`);
  console.log(arg);
  console.log('***\n');
};

export default class IPC {
  constructor() {
    ipcMain.on('CHOOSE_DIR', (event, arg) => {
      logMainOn(arg, 'CHOOSE_DIR');
      const selectedPaths = dialog.showOpenDialogSync({
        properties: ['openDirectory', 'multiSelections'],
      });
      if (!selectedPaths) {
        throw new Error('Why no paths selected?');
      }
      const path = selectedPaths[0];

      const dirs = new Directories();
      dirs.addDirectory(path);
      event.reply('DIR_LIST', JSON.stringify(dirs.getDirectories()));
    });

    ipcMain.on('REMOVE_DIR', (event, arg) => {
      logMainOn(arg, 'REMOVE_DIR');
      const path = arg[0];
      const dirs = new Directories();
      dirs.removeDirectory(path);
      const dirList = dirs.getDirectories();
      event.reply('DIR_LIST', JSON.stringify(dirList));
    });

    ipcMain.on('SYNC_QUERY_VIEW', (event, arg) => {
      logMainOn(arg, 'SYNC_QUERY_VIEW');
      const dirs = new Directories();
      const dirList = dirs.getDirectories();
      event.reply('DIR_LIST', JSON.stringify(dirList));
    });
  }
}
