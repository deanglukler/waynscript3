import fs from 'fs';
import _ from 'lodash';
import path from 'path';

import { insertSamples } from '../db/samples';
import { AnalyzedFile, ScanProgress } from '../types';

export const audioExts = ['.wav', '.aiff', '.mp3'];

const recursiveFileList = (
  directoryPath: string,
  includeExts: string[],
  includeAnyExt: boolean
): string[] => {
  let filelist: string[] = [];
  fs.readdirSync(directoryPath, { withFileTypes: true }).forEach((file) => {
    if (file.isDirectory()) {
      const recursivePath = path.resolve(directoryPath, file.name);
      filelist = filelist.concat(
        recursiveFileList(recursivePath, includeExts, includeAnyExt)
      );
    }
    const ext = path.extname(file.name);
    if (!includeAnyExt && !includeExts.includes(ext)) {
      return;
    }
    filelist.push(path.resolve(directoryPath, file.name));
  });
  return filelist;
};

export const allAudioFilesInDir = (dir: string): string[] => {
  return recursiveFileList(dir, audioExts, false);
};

const analyzeFile = (filePath: string) => {
  // const bpm = new BpmAnal(filePath);
  // const key = new KeyAnal(filePath);
  // const tags = new TagAnal(filePath);
  return {
    path: filePath,
    // bpm: bpm.bpm,
    // key: key.key,
    // tags: tags.tags,
  };
};

const ANALISIS_CHUNK_SIZE = 1000;

export default class FileScan {
  public audioFilePaths: string[] = [];

  public totalFiles: number = 0;

  public totalFilesAnalyzed: number = 0;

  public scanActive: boolean = false;

  public ipcEvent: Electron.IpcMainEvent | null = null;

  constructor(public dirPath: string) {
    this.audioFilePaths = allAudioFilesInDir(dirPath);
    this.totalFiles = this.audioFilePaths.length;
    this.analyzeFiles();
  }

  private analyzeFiles() {
    this.scanActive = true;

    const fileChunks = _.chunk(this.audioFilePaths, ANALISIS_CHUNK_SIZE);
    const fileChunksLength = _.size(fileChunks);

    console.log(
      `\nAnalyzing file chunks --> ${fileChunksLength} (x ${ANALISIS_CHUNK_SIZE})\n`
    );

    return new Promise<void>((resolve) => {
      const asyncAnalysis = (chunks: string[][]) => {
        if (chunks.length > 0) {
          setTimeout(() => {
            const analyzedFiles: AnalyzedFile[] = [];
            chunks[0].forEach((file) => {
              analyzedFiles.push(analyzeFile(file));
              this.totalFilesAnalyzed++;
            });
            insertSamples(analyzedFiles);
            chunks.shift();
            asyncAnalysis(chunks);
            this.updateProgress();
          }, 10);
        } else {
          this.scanActive = false;
          this.updateProgress();
          resolve();
        }
      };

      asyncAnalysis(fileChunks);
    });
  }

  private updateProgress(): void {
    if (!this.ipcEvent) return;

    const scanProgress: ScanProgress = {
      total: this.totalFiles,
      finished: !this.scanActive,
      scanned: this.totalFilesAnalyzed,
    };

    this.ipcEvent.reply('UPDATE_SCAN_PROGRESS', scanProgress);
  }

  /**
   * updateProgressWithEvent
   */
  public updateProgressWithEvent(event: Electron.IpcMainEvent) {
    this.ipcEvent = event;
  }
}
