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
import { Directory } from '../types';
import { audioExts } from './constants';

const { username } = os.userInfo();

export class DirectoryScan {
  public rootDirPath: string = path.join(`/users/${username}`);
  // public rootDirPath: string = path.join(
  //   `/Users/nice/__stuff/__life/_music_production/_samples/z_random`
  // );

  public rootDir: Directory | null = null;

  constructor() {
    this.rootDir = getRootDirectory(this.rootDirPath);
    if (!this.rootDir) {
      this.rootDir = makeRootDirectory(this.rootDirPath);
    }
  }

  public async scan() {
    if (!this.rootDir) throw new Error('expected a rootDir');
    await this.scanDir(this.rootDir.path);
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

  private async scanDir(dirPath: string): Promise<{
    totalSamples: number;
    childLeadsToSamples: boolean;
    dirID: number | null;
  }> {
    const isRootDir = this.rootDir?.path === dirPath;
    let totalSamplesInAndBelowDir = 0;
    let isSampleDir = true;
    let currentChildDirLeadsToSamples = false;
    const childDirs: string[] = [];
    let filesScanedInCurrentDir = 0;
    let totalAudioFilesInCurrentDir = 0;
    let dirID: null | number = null;

    if ([`/users/${username}/Library`].includes(dirPath)) {
      return {
        totalSamples: totalSamplesInAndBelowDir,
        childLeadsToSamples: false,
        dirID,
      };
    }

    let directoryFiles: Dirent[] = [];
    try {
      directoryFiles = await fs.readdir(dirPath, { withFileTypes: true });
      directoryFiles = directoryFiles.filter(
        (item) => !/(^|\/)\.[^/.]/g.test(item.name)
      );
    } catch (error) {
      console.log('\nERROR: scanning directory. (this error was caught)');
      console.log(error);
    }

    directoryFiles.forEach((file) => {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        childDirs.push(filePath);
      } else if (file.isFile()) {
        if (!isSampleDir) return;

        const { ext } = path.parse(filePath);
        if (audioExts.includes(ext)) {
          totalAudioFilesInCurrentDir++;
        }
        filesScanedInCurrentDir++;
      }

      if (filesScanedInCurrentDir > 10 && totalAudioFilesInCurrentDir < 5) {
        isSampleDir = false;
      }
    });

    if (
      filesScanedInCurrentDir === 0 ||
      totalAudioFilesInCurrentDir / filesScanedInCurrentDir < 0.5
    ) {
      isSampleDir = false;
    } else {
      totalSamplesInAndBelowDir += totalAudioFilesInCurrentDir;
      currentChildDirLeadsToSamples = true;
    }

    if (isRootDir) {
      totalSamplesInAndBelowDir += totalAudioFilesInCurrentDir;
    }

    const childs = await Promise.all(
      childDirs.map(async (childDir) => {
        const child = await this.scanDir(childDir);
        const { totalSamples, childLeadsToSamples } = child;
        if (childLeadsToSamples) {
          currentChildDirLeadsToSamples = true;
        }
        totalSamplesInAndBelowDir += totalSamples;
        return child;
      })
    );

    // if (anyChildLeadsToSamples || isSampleDir) {
    //   updateTotalSamples(currentParentID, totalChildSamples);
    // } else {
    //   deleteDirectory(currentParentID);
    // }

    const dirShouldBeSaved =
      currentChildDirLeadsToSamples || isSampleDir || isRootDir;

    if (dirShouldBeSaved) {
      if (isRootDir) {
        console.log('found root dir..');
        if (!this.rootDir?.id) {
          throw new Error('wtf');
        }
        dirID = this.rootDir.id;
        updateTotalSamples(dirID, totalSamplesInAndBelowDir);
      } else {
        const { lastInsertRowid } = addDirectory(
          dirPath,
          totalSamplesInAndBelowDir
        );
        dirID = lastInsertRowid as number;
      }

      const directoryChildsValues = childs
        .filter((child) => child.dirID != null)
        .map((child) => {
          if (!dirID || !child.dirID) {
            throw new Error('directory ids should never be null here');
          }
          return [dirID, child.dirID] as [number, number];
        });
      addDirectoryChilds(directoryChildsValues);
    }

    return {
      totalSamples: totalSamplesInAndBelowDir,
      childLeadsToSamples: currentChildDirLeadsToSamples,
      dirID,
    };
  }
}
