import { Dirent } from 'fs';
import _ from 'lodash';
import fs from 'node:fs/promises';
import os from 'os';
import path from 'path';

import {
  addDirectory,
  addDirectoryChilds,
  getAllTotalSamples,
  getRootDirectory,
  getTotalSamplesData,
  makeRootDirectory,
  setAllDirectChildsOfRootToTopLevel,
  setAllDirsToViewWithTotalAbove,
  setAllLastChildDirs,
  updateTotalSamples,
} from '../db/directories';
import { Directory } from '../../shared/types';
import { audioExts } from './constants';
import { Progress } from './Progress';
import Windows from './Windows';

const { username } = os.userInfo();

const IGNORED_DIRECTORIES = [`/users/${username}/Library`];

interface ScanDirResults {
  totalSamplesInDirAndChilds: number;
  dirOrChildsHaveSamples: boolean;
  dirID: number | null;
}
interface CurrentDirScan {
  isSampleDir: boolean;
  childDirs: string[];
  totalAudioFiles: number;
  filesScanned: number;
  isRootDir: boolean;
}

export class DirectoryScan {
  public rootDirPath: string = path.join(`/users/${username}`);

  public rootDir: Directory | null = null;

  public progress: Progress = new Progress();

  constructor(public windows: Windows) {
    this.rootDir = getRootDirectory(this.rootDirPath);
    if (!this.rootDir) {
      this.rootDir = makeRootDirectory(this.rootDirPath);
    }
  }

  public async scan() {
    if (!this.rootDir) throw new Error('expected a rootDir');
    await this.scanDir(this.rootDir.path);

    this.progress.processed = this.progress.total;
    this.updateRendererProgress();

    this.setTopLevelDirs();
    DirectoryScan.setInitViewDirs();
    setAllLastChildDirs();
  }

  private setTopLevelDirs() {
    console.log('\nFinding top level Directories');
    // First of all set all direct children of root directory to be top_level
    if (!this.rootDir?.id) {
      throw new Error('wtf');
    }
    setAllDirectChildsOfRootToTopLevel(this.rootDir.id);
  }

  static setInitViewDirs() {
    const { avg, count } = getTotalSamplesData();
    const counts = getAllTotalSamples();
    const standardDeviation = Math.sqrt(
      _.sum(_.map(counts, (dir) => (dir.total_samples - avg) ** 2)) / count
    );
    console.log(`(total_samples) AVERAGE ${avg}`);
    console.log(`(total_samples) COUNT ${count}`);
    console.log(`(total_samples) STANDARD DEVIATION ${standardDeviation}`);

    setAllDirsToViewWithTotalAbove(standardDeviation);
  }

  private async scanDir(dirPath: string): Promise<ScanDirResults> {
    const scanResults: ScanDirResults = {
      totalSamplesInDirAndChilds: 0,
      dirOrChildsHaveSamples: false,
      dirID: null,
    };

    if (directoryShouldNotBeIncluded(dirPath)) {
      return scanResults;
    }

    let directoryFiles: Dirent[] = [];
    try {
      directoryFiles = await fs.readdir(dirPath, { withFileTypes: true });
      directoryFiles = filterDotFiles(directoryFiles);
    } catch (error) {
      console.log('\nERROR: scanning directory. (this error was caught)');
      console.log(error);
    }

    const currentDir: CurrentDirScan = {
      isSampleDir: true,
      childDirs: [],
      totalAudioFiles: 0,
      filesScanned: 0,
      isRootDir: this.rootDir?.path === dirPath,
    };

    directoryFiles.forEach(scanFileForAudio(dirPath, currentDir));

    addTotalAudioFiles(currentDir, scanResults);

    const childs = await Promise.all(
      currentDir.childDirs.map(async (childDir) => {
        this.progress.total += 1;
        const child = await this.scanDir(childDir);
        this.progress.incrementProcessed(1);
        this.updateRendererProgress();
        const { totalSamplesInDirAndChilds, dirOrChildsHaveSamples } = child;
        if (dirOrChildsHaveSamples) {
          scanResults.dirOrChildsHaveSamples = true;
        }
        scanResults.totalSamplesInDirAndChilds += totalSamplesInDirAndChilds;
        return child;
      })
    );

    if (dirShouldBeSaved(scanResults, currentDir)) {
      if (currentDir.isRootDir) {
        this.saveRootDirectory(scanResults);
      } else {
        saveNonRootDirectory(dirPath, scanResults);
      }
      saveDirectoryChildLinks(childs, scanResults);
    }

    return scanResults;
  }

  private saveRootDirectory(scanResults: ScanDirResults) {
    console.log('found root dir..');
    if (!this.rootDir?.id) {
      throw new Error('wtf');
    }
    scanResults.dirID = this.rootDir.id;
    updateTotalSamples(
      scanResults.dirID,
      scanResults.totalSamplesInDirAndChilds
    );
  }

  private updateRendererProgress(): void {
    if (!this.windows) return;

    this.windows.sendWindowMessage(
      'queryWindow',
      'UPDATE_DIRSCAN_PROGRESS',
      this.progress
    );
  }
}
function scanFileForAudio(
  dirPath: string,
  currentDir: CurrentDirScan
): (value: Dirent, index: number, array: Dirent[]) => void {
  return (file) => {
    const filePath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      currentDir.childDirs.push(filePath);
    } else if (file.isFile()) {
      if (!currentDir.isSampleDir) return;

      const { ext } = path.parse(filePath);
      if (audioExts.includes(ext)) {
        currentDir.totalAudioFiles++;
      }
      currentDir.filesScanned++;
    }

    checkMajorityOfFilesAreAudio(currentDir);
  };
}

function saveDirectoryChildLinks(
  childs: ScanDirResults[],
  scanResults: ScanDirResults
) {
  const directoryChildsValues = childs
    .filter((child) => child.dirID != null)
    .map((child) => {
      if (scanResults.dirID == null || child.dirID == null) {
        throw new Error('directory ids should never be null here');
      }
      return [scanResults.dirID, child.dirID] as [number, number];
    });
  addDirectoryChilds(directoryChildsValues);
}

function saveNonRootDirectory(dirPath: string, scanResults: ScanDirResults) {
  const { lastInsertRowid } = addDirectory(
    dirPath,
    scanResults.totalSamplesInDirAndChilds
  );
  scanResults.dirID = lastInsertRowid as number;
}

function dirShouldBeSaved(
  scanResults: ScanDirResults,
  currentDir: CurrentDirScan
) {
  return (
    scanResults.dirOrChildsHaveSamples ||
    currentDir.isSampleDir ||
    currentDir.isRootDir
  );
}

function addTotalAudioFiles(
  currentDir: CurrentDirScan,
  scanResults: ScanDirResults
) {
  if (
    currentDir.filesScanned === 0 ||
    currentDir.totalAudioFiles / currentDir.filesScanned < 0.5
  ) {
    currentDir.isSampleDir = false;
  } else {
    scanResults.totalSamplesInDirAndChilds += currentDir.totalAudioFiles;
    scanResults.dirOrChildsHaveSamples = true;
  }

  if (currentDir.isRootDir) {
    scanResults.totalSamplesInDirAndChilds += currentDir.totalAudioFiles;
  }
}

function checkMajorityOfFilesAreAudio(currentDir: CurrentDirScan) {
  if (currentDir.filesScanned > 10 && currentDir.totalAudioFiles < 5) {
    currentDir.isSampleDir = false;
  }
}

function directoryShouldNotBeIncluded(dirPath: string) {
  return IGNORED_DIRECTORIES.includes(dirPath);
}

function filterDotFiles(directoryFiles: Dirent[]): Dirent[] {
  return directoryFiles.filter((item) => !/(^|\/)\.[^/.]/g.test(item.name));
}
