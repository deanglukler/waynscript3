import { AppState } from '../AppState';
import { createDirsTables, dropDirsTables } from '../db/directories';
import { createSamplesTable, dropSamplesTable } from '../db/samples';
import { createTagsTable, dropTagsTable } from '../db/tags';
import { createWordsTable, dropWordsTable } from '../db/words';
import { Channels } from '../preload';
import { DirectoryScan } from '../utils/DirectoryScan';
import FileScan from '../utils/FileScan';
import { Progress } from '../utils/Progress';
import { Msg } from './Msg';
import { WordsAnalysis } from '../utils/WordsAnalysis';
import {
  createDirChildsTable,
  dropDirChildsTable,
} from '../db/directory_childs';
import { RenderSync } from './RenderSync';

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

      await new DirectoryScan({
        onProgressUpdate: (progress) => {
          sendProgressToWindowIfExists(progress, 'UPDATE_DIRSCAN_PROGRESS');
          AppState.updateScanState((currentScanState) => {
            currentScanState.dirScanProgress = progress;
          });
        },
      }).scan();

      await new FileScan({
        onProgressUpdate: (progress) => {
          sendProgressToWindowIfExists(progress, 'UPDATE_FILESCAN_PROGRESS');
          AppState.updateScanState((currentScanState) => {
            currentScanState.fileScanProgress = progress;
          });
        },
      }).analyzeFiles();

      await new WordsAnalysis({
        onProgressUpdate: (progress) => {
          sendProgressToWindowIfExists(progress, 'UPDATE_WORDANAL_PROGRESS');
          AppState.updateScanState((currentScanState) => {
            currentScanState.wordsScanProgress = progress;
          });
        },
      }).analyzeWordsAsync();

      finish();
    }
    return Promise.resolve();
  }
}

function sendProgressToWindowIfExists(progress: Progress, channel: Channels) {
  Msg.send(channel, progress);
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
