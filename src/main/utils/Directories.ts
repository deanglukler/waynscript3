import { dialog, ipcMain } from 'electron';
import _ from 'lodash';
import {
  activateDir,
  deActivateDir,
  getVisibleChildDirs,
  getTopLevelDirs,
  setViewDir,
} from '../db/directories';
import { DirectoryMap } from '../../shared/types';
import { logMainOn } from './log';
import Windows from './Windows';

export default class Directories {
  static initIPC(
    windows: Windows,
    refreshSampleList: () => void,
    refreshQueryStats: () => void
  ) {
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
            active: childDir.active,
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

    ipcMain.on('SYNC_DIRS', (_event, arg) => {
      logMainOn(arg, 'SYNC_DIRS');
      syncDirectories();
      refreshSampleList();
      refreshQueryStats();
    });

    ipcMain.on(`ACTIVATE_VIEW_DIR`, (_event, arg) => {
      const id = arg[0] as number;
      setViewDir(id, true);
      syncDirectories();
    });

    ipcMain.on(`DEACTIVATE_VIEW_DIR`, (_event, arg) => {
      const id = arg[0] as number;
      setViewDir(id, false);
      syncDirectories();
    });

    ipcMain.on('ACTIVATE_DIR', (_event, arg) => {
      logMainOn(arg, 'ACTIVATE_DIR');
      const id = arg[0];
      activateDir(id);
      syncDirectories();
      refreshSampleList();
      refreshQueryStats();
    });

    ipcMain.on('DEACTIVATE_DIR', (_event, arg) => {
      logMainOn(arg, 'DEACTIVATE_DIR');
      const id = arg[0];
      deActivateDir(id);
      syncDirectories();
      refreshSampleList();
      refreshQueryStats();
    });

    // may potentially reuse this logic in future dialogues
    ipcMain.on('CHOOSE_DIR', (_event, arg) => {
      logMainOn(arg, 'CHOOSE_DIR');
      const selectedPaths = dialog.showOpenDialogSync({
        properties: ['openDirectory', 'multiSelections'],
      });

      if (!selectedPaths) {
        console.log('Why no paths selected?');
        return;
      }

      const path = selectedPaths[0];
    });
  }
}
