import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { getDirectories } from '../db/directories';

import { deleteSamples, getAllSamples, insertSamples } from '../db/samples';
import { insertWordsAndSamples } from '../db/words';
import { SampleAnalysis, ScanProgress } from '../types';
import { BpmAnalysis } from './BpmAnalysis';
import { KeyAnalysis } from './KeyAnalysis';
import Windows from './Windows';
import { WordsAnalysis } from './WordsAnalysis';

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

const analyzeFile = (filePath: string): SampleAnalysis => {
  const { name } = path.parse(filePath);
  // we may find bpm info in the whole path?
  const bpm = new BpmAnalysis(filePath);
  const key = new KeyAnalysis(name);
  const words = new WordsAnalysis(name).words.map((word) => {
    return {
      word,
      sampleWord: {
        path: filePath,
        word,
      },
    };
  });

  return {
    path: filePath,
    bpm: bpm.bpm,
    key: key.key,
    words,
  };
};

const ANALISIS_CHUNK_SIZE = 800;

export default class FileScan {
  public filesToScan: string[] = [];

  public filesToClean: string[] = [];

  public totalFiles: number = 0;

  public totalFilesAnalyzed: number = 0;

  public scanActive: boolean = false;

  constructor(public windows: Windows) {
    const directories = getDirectories();
    const activePathsMap: { [key: string]: string } = {};
    directories.forEach((dir) => {
      const audioFilePathsInDir = allAudioFilesInDir(dir.path);
      audioFilePathsInDir.forEach((filepath) => {
        activePathsMap[filepath] = filepath;
      });
    });
    const activePaths = _.keys(activePathsMap);
    const cachedPaths = getAllSamples().map(({ path: sPath }) => sPath);

    this.filesToScan = [...activePaths];
    _.pullAll(this.filesToScan, cachedPaths);

    this.filesToClean = [...cachedPaths];
    _.pullAll(this.filesToClean, activePaths);

    this.totalFiles = this.filesToScan.length;
  }

  public cleanFiles() {
    deleteSamples(this.filesToClean);
  }

  public analyzeFiles() {
    this.scanActive = true;

    const fileChunks = _.chunk(this.filesToScan, ANALISIS_CHUNK_SIZE);
    const fileChunksLength = _.size(fileChunks);

    console.log(
      `\nAnalyzing file chunks --> ${fileChunksLength} (x ${ANALISIS_CHUNK_SIZE})\n`
    );

    return new Promise<void>((resolve) => {
      const asyncAnalysis = (chunks: string[][]) => {
        if (chunks.length > 0) {
          setTimeout(() => {
            const analyzedFiles: SampleAnalysis[] = [];
            chunks[0].forEach((file) => {
              analyzedFiles.push(analyzeFile(file));
              this.totalFilesAnalyzed++;
            });
            insertSamples(analyzedFiles);
            insertWordsAndSamples(analyzedFiles);
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
    if (!this.windows) return;

    const scanProgress: ScanProgress = {
      total: this.totalFiles,
      finished: !this.scanActive,
      scanned: this.totalFilesAnalyzed,
    };

    this.windows.sendWindowMessage(
      'queryWindow',
      'UPDATE_SCAN_PROGRESS',
      scanProgress
    );
  }
}
