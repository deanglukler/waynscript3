import { readdir } from 'node:fs/promises';
import _ from 'lodash';
import path from 'path';
import { getActiveDirectories, getDirectories } from '../db/directories';

import { getSamplesInActiveDirs, insertSamples } from '../db/samples';
import { Directory, Sample, ScanProgress } from '../types';
import { BpmAnalysis } from './BpmAnalysis';
import { KeyAnalysis } from './KeyAnalysis';
import Windows from './Windows';
import { audioExts } from './constants';

const recursiveFileList = async (
  directoryPath: string,
  includeExts: string[],
  includeAnyExt: boolean
): Promise<string[]> => {
  let filelist: string[] = [];
  const files = await readdir(directoryPath, { withFileTypes: true });
  await Promise.all(
    files.map(async (file) => {
      if (file.isDirectory()) {
        const recursivePath = path.resolve(directoryPath, file.name);
        try {
          const recusiveList = await recursiveFileList(
            recursivePath,
            includeExts,
            includeAnyExt
          );
          filelist = filelist.concat(recusiveList);
        } catch (error) {
          console.log('ERROR READING FILE LIST!');
          console.log(error);
        }
      }
      const ext = path.extname(file.name);
      if (!includeAnyExt && !includeExts.includes(ext)) {
        return null;
      }
      filelist.push(path.resolve(directoryPath, file.name));
      return null;
    })
  );
  return filelist;
};

export const allAudioFilesInDir = (dir: string): Promise<string[]> => {
  return recursiveFileList(dir, audioExts, false);
};

export const allAudioFilesInDirsList = async (
  dirs: string[]
): Promise<string[]> => {
  const filelist: string[] = [];
  await Promise.all(
    dirs.map(async (directoryPath) => {
      const files = await readdir(directoryPath, { withFileTypes: true });
      files.forEach((file) => {
        if (file.isDirectory()) {
          return;
        }
        const ext = path.extname(file.name);
        if (audioExts.includes(ext)) {
          filelist.push(path.resolve(directoryPath, file.name));
        }
      });
    })
  );
  return filelist;
};

const ANALISIS_CHUNK_SIZE = 800;

interface DirMap {
  [key: string]: Directory;
}

export default class FileScan {
  public filesToScan: string[] = [];

  public totalFiles: number = 0;

  public totalFilesAnalyzed: number = 0;

  public scanActive: boolean = false;

  public allDirectoriesMap: DirMap = {};

  constructor(public windows: Windows) {}

  private analyzeFile(filePath: string): Sample {
    const { name, dir } = path.parse(filePath);
    // we may find bpm info in the whole path?
    const bpm = new BpmAnalysis(filePath);
    const key = new KeyAnalysis(name);

    if (!this.allDirectoriesMap[dir]) {
      console.log('\nUNDEFINED DIR');
      console.log(dir);
    }

    if (!this.allDirectoriesMap[dir]) {
      console.log(
        '\nWARNING: directory of file path does not exist in database'
      );
    }
    const dirId = this.allDirectoriesMap[dir]?.id || 0;

    return {
      dir_id: dirId,
      path: filePath,
      bpm: bpm.bpm,
      key: key.key,
    };
  }

  private async analyzeFilesToScan() {
    // const activeDirs = getActiveDirectories();
    const allDirs = getDirectories();
    allDirs.forEach((dir) => {
      this.allDirectoriesMap[dir.path] = dir;
    });

    this.filesToScan = await allAudioFilesInDirsList(
      allDirs.map((dir) => dir.path)
    );

    this.totalFiles = this.filesToScan.length;
  }

  public async analyzeFiles() {
    await this.analyzeFilesToScan();

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
            const analyzedFiles: Sample[] = [];
            chunks[0].forEach((file) => {
              analyzedFiles.push(this.analyzeFile(file));
              this.totalFilesAnalyzed++;
            });
            insertSamples(analyzedFiles);
            chunks.shift();
            asyncAnalysis(chunks);
            this.updateProgress();
          }, 1);
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
