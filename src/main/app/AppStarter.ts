import { dialog, ipcMain } from 'electron';

import {
  MainWindowStart,
  MainWindowStoreData,
  Query,
  Sample,
} from '../../types';
import { AppState } from '../AppState';
import { getLastQuery } from '../db/queries';
import { getSamplesByQuery } from '../db/samples';
import Directories from '../utils/Directories';
import { logMainOn } from '../utils/log';
import { Queries } from '../utils/Queries';
import QueryStats from '../utils/QueryStats';
import { RenderSync } from './RenderSync';

export class AppStarter {
  static async startMainWindow({
    appState,
  }: {
    appState: AppState;
  }): Promise<MainWindowStart> {
    const wordStats = await QueryStats.getWordStats();
    return new Promise<MainWindowStart>((resolve) => {
      const files: Sample[] = getSamplesByQuery();
      const { bpms, keys, words, tags, directories } = getLastQuery();
      const bpmStats = QueryStats.getBpmStats();
      const keyStats = QueryStats.getKeyStats();
      const tagStats = QueryStats.getTagStats();
      const dirMaps = Directories.getDirMaps();
      const initStoreData: MainWindowStoreData = {
        scans: appState.scans,
        bpms,
        keys,
        words,
        tags,
        directories,
        dirMaps,
        bpmStats,
        keyStats,
        wordStats,
        tagStats,
        files,
        layout: {
          sampleList: {
            width: '100px',
          },
          directoryList: {
            width: '100px',
          },
          query: {
            width: '100px',
          },
        },
      };
      resolve({ initializedStoreData: initStoreData });
    });
  }

  static initIpc() {
    ipcMain.on('SYNC_QUERY', (_event, arg: [Query]) => {
      logMainOn(arg, 'SYNC_QUERY');
      const query = arg[0];
      Queries.addQuery(query);
      RenderSync.syncSampleList();
      RenderSync.syncQueryStats();
    });

    ipcMain.on(`ACTIVATE_VIEW_DIR`, (_event, arg) => {
      const id = arg[0] as number;
      Directories.setViewDir(id, true);
      RenderSync.syncDirectories();
    });

    ipcMain.on(`DEACTIVATE_VIEW_DIR`, (_event, arg) => {
      const id = arg[0] as number;
      Directories.setViewDir(id, false);
      RenderSync.syncDirectories();
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
