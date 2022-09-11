import { AppState } from '../AppState';
import { createDirsTables, dropDirsTables } from '../../db/directories';
import { createSamplesTable, dropSamplesTable } from '../../db/samples';
import { createTagsTable, dropTagsTable } from '../../db/tags';
import { createWordsTable, dropWordsTable } from '../../db/words';
import { Msg } from '../Msg';
import {
  createDirChildsTable,
  dropDirChildsTable,
} from '../../db/directory_childs';
import { RenderSync } from '../RenderSync';
import { DirectoriesScan } from './DirectoriesScan';
import { SamplesAnalysis } from './SamplesAnalysis';

export class Scans {
  static async init(): Promise<void> {
    if (
      process.env.RESCAN_FILES === 'true' ||
      process.env.NODE_ENV === 'production'
    ) {
      dropWordsTable();
      dropTagsTable();
      dropSamplesTable();
      dropDirChildsTable();
      dropDirsTables();
      createDirsTables();
      createDirChildsTable();
      createSamplesTable();
      createWordsTable();
      createTagsTable();

      notifyStart();
      AppState.startScan();

      const dirScan = new DirectoriesScan({
        onProgressUpdate: (progress) => {
          Msg.send('UPDATE_DIRSCAN_PROGRESS', progress);
          AppState.updateScanState((currentScanState) => {
            currentScanState.dirScanProgress = progress;
          });
        },
      });
      await dirScan.scan();
      dirScan.writeDirectoriesToDatabase();
      const { discoveredSamples } = dirScan;

      const fileAnalasis = new SamplesAnalysis(discoveredSamples, {
        onProgressUpdate: (progress) => {
          Msg.send('UPDATE_FILESCAN_PROGRESS', progress);
          AppState.updateScanState((currentScanState) => {
            currentScanState.fileScanProgress = progress;
          });
        },
      });
      await fileAnalasis.analyze();

      finish();
    }
    return Promise.resolve();
  }
}

function notifyStart() {
  Msg.send('START_SCAN', null);
}

function finish() {
  AppState.finishScan();
  Msg.send('FINISH_SCAN', null);
  RenderSync.syncDirectories();
  RenderSync.syncSampleList();
  RenderSync.syncQueryStats();
}
