import { dialog, ipcMain } from 'electron';
import _ from 'lodash';
import {
  activateDir,
  addDirectory,
  deActivateDir,
  getDirectories,
  getVisibleChildDirs,
  getTopLevelDirs,
  removeDirectory,
  setViewDir,
} from '../db/directories';
import { Directory, DirectoryMap } from '../types';
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

    function syncDirectories() {
      const topLevelDirs = getTopLevelDirs();
      const relevantDirs = getVisibleChildDirs();

      const takeAllChildDirs = (parentDirID: number): DirectoryMap[] => {
        const childs = relevantDirs.filter(
          (dir) => dir.parent_id === parentDirID
        );
        // clean up array for efficiency
        _.pullAllBy(relevantDirs, childs, 'child_id');

        return childs.map((childDir) => {
          return {
            id: childDir.child_id,
            path: childDir.child_path,
            top_level: childDir.top_level,
            viewing: childDir.viewing,
            last_child: childDir.last_child,
            total_samples: childDir.total_samples,
            childs: takeAllChildDirs(childDir.child_id),
          };
        });
      };

      const dirMaps: DirectoryMap[] = topLevelDirs.map((dir) => {
        const dirMap: DirectoryMap = { ...dir, childs: [] };
        dirMap.childs = takeAllChildDirs(dir.id);
        return dirMap;
      });

      windows.sendWindowMessage('queryWindow', 'RECEIVE_DIR_SYNC', dirMaps);
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

    ipcMain.on('SYNC_DIRS', (event, arg) => {
      logMainOn(arg, 'SYNC_DIRS');
      syncDirectories();
    });

    ipcMain.on(`ACTIVATE_VIEW_DIR`, (event, arg) => {
      const id = arg[0] as number;
      setViewDir(id, true);
      syncDirectories();
    });

    ipcMain.on(`DEACTIVATE_VIEW_DIR`, (event, arg) => {
      const id = arg[0] as number;
      setViewDir(id, false);
      syncDirectories();
    });

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
