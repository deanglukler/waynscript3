import { dialog, ipcMain } from 'electron';
import {
  activateDir,
  addDirectory,
  deActivateDir,
  getDirectories,
  removeDirectory,
} from '../db/directories';
import FileScan from './FileScan';
import { logMainOn } from './log';
import Windows from './Windows';

export default class Directories {
  static initIPC(
    windows: Windows,
    refreshSampleList: () => void,
    refreshQueryStats: () => void
  ) {
    function refreshRendererDirList() {
      windows.sendWindowMessage('queryWindow', 'DIR_LIST', getDirectories());
    }

    function sync() {
      refreshRendererDirList();
      refreshSampleList();
      refreshQueryStats();
    }

    function scan() {
      const fScan = new FileScan(windows);
      fScan.cleanFiles();
      // eslint-disable-next-line promise/catch-or-return
      fScan.analyzeFiles().then(() => {
        sync();
        return null;
      });
    }

    ipcMain.on('CHOOSE_DIR', (event, arg) => {
      logMainOn(arg, 'CHOOSE_DIR');
      const selectedPaths = dialog.showOpenDialogSync({
        properties: ['openDirectory', 'multiSelections'],
      });

      if (!selectedPaths) {
        console.log('Why no paths selected?');
        return;
      }

      const path = selectedPaths[0];

      addDirectory(path);
      sync();
      scan();
    });

    ipcMain.on('REMOVE_DIR', (event, arg) => {
      logMainOn(arg, 'REMOVE_DIR');
      const path = arg[0];
      removeDirectory(path);
      sync();
    });

    ipcMain.on('SYNC_FILE_BROWSE', (event, arg) => {
      logMainOn(arg, 'SYNC_FILE_BROWSE');
      sync();
    });

    ipcMain.on('ACTIVATE_DIR', (event, arg) => {
      logMainOn(arg, 'ACTIVATE_DIR');
      const path = arg[0];
      activateDir(path);
      sync();
    });

    ipcMain.on('DEACTIVATE_DIR', (event, arg) => {
      logMainOn(arg, 'DEACTIVATE_DIR');
      const path = arg[0];
      deActivateDir(path);
      sync();
    });

    ipcMain.on('SCAN_DIRS', (event, arg) => {
      logMainOn(arg, 'SCAN_DIRS');
      sync();
      scan();
    });
  }
}
