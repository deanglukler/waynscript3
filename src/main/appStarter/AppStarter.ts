import { BrowserWindow } from 'electron';
import { createDirsTables, dropDirsTables } from '../db/directories';
import { createSamplesTable, dropSamplesTable } from '../db/samples';
import { createTagsTable, dropTagsTable } from '../db/tags';
import { createWordsTable, dropWordsTable } from '../db/words';
import { DirectoryScan } from '../utils/DirectoryScan';
import FileScan from '../utils/FileScan';
import windowMessage from '../utils/windowMessage';
import { WordsAnalysis } from '../utils/WordsAnalysis';

export class AppStarter {
  constructor(private window: BrowserWindow) {}

  /**
   * start getting all data ready for renderer use
   */
  public async start(): Promise<void> {
    if (
      process.env.RESCAN_FILES === 'true' ||
      process.env.NODE_ENV === 'production'
    ) {
      dropWordsTable();
      dropTagsTable();
      dropSamplesTable();
      dropDirsTables();
      createDirsTables();
      createSamplesTable();
      createWordsTable();
      createTagsTable();
      await new DirectoryScan({
        onProgressUpdate: (progress) => {
          windowMessage({
            window: this.window,
            channel: 'UPDATE_DIRSCAN_PROGRESS',
            payload: progress,
          });
        },
      }).scan();
      await new FileScan({
        onProgressUpdate: (progress) => {
          windowMessage({
            window: this.window,
            channel: 'UPDATE_FILESCAN_PROGRESS',
            payload: progress,
          });
        },
      }).analyzeFiles();
      await new WordsAnalysis({
        onProgressUpdate: (progress) => {
          windowMessage({
            window: this.window,
            channel: 'UPDATE_WORDANAL_PROGRESS',
            payload: progress,
          });
        },
      }).analyzeWordsAsync();

      this.finish();

      return Promise.resolve();
    }
  }

  private finish() {
    windowMessage({
      window: this.window,
      channel: 'APP_INIT_FINISHED',
      payload: null,
    });
  }
}
