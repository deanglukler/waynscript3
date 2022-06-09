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
  static initIPC(windows: Windows, refreshSampleList: () => void) {
    function refreshRendererDirList() {
      windows.sendWindowMessage('queryWindow', 'DIR_LIST', getDirectories());
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
      refreshRendererDirList();
      refreshSampleList();
    });

    ipcMain.on('REMOVE_DIR', (event, arg) => {
      logMainOn(arg, 'REMOVE_DIR');
      const path = arg[0];
      removeDirectory(path);
      refreshRendererDirList();
      refreshSampleList();
    });

    ipcMain.on('SYNC_QUERY_VIEW', (event, arg) => {
      logMainOn(arg, 'SYNC_QUERY_VIEW');
      refreshRendererDirList();
      refreshSampleList();
    });

    ipcMain.on('ACTIVATE_DIR', (event, arg) => {
      logMainOn(arg, 'ACTIVATE_DIR');
      const path = arg[0];
      activateDir(path);
      refreshRendererDirList();
      refreshSampleList();
    });

    ipcMain.on('DEACTIVATE_DIR', (event, arg) => {
      logMainOn(arg, 'DEACTIVATE_DIR');
      const path = arg[0];
      deActivateDir(path);
      refreshRendererDirList();
      refreshSampleList();
    });

    ipcMain.on('SCAN_DIR', (event, arg) => {
      logMainOn(arg, 'SCAN_DIR');
      const path = arg[0];
      const fScan = new FileScan(path);
      fScan.updateProgressWithEvent(event);
      // eslint-disable-next-line promise/catch-or-return
      fScan.analyzeFiles().then(() => {
        refreshSampleList();
        return null;
      });
      refreshRendererDirList();
    });
  }
}
