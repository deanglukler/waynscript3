import path from 'path';
import fs, { Dirent } from 'fs';
import { USER_DIR } from '../../shared/constants';
import { audioExts } from '../../utils/audioExts';
import { FoundSampleDirectory, Scan } from '../../../types';
import Directories from '../../dbInteract/Directories';
import { ProgressiveScan } from './ProgressiveScan';

const ENOUGH_AUDIO_FILES = 5;
const IGNORED_DIRECTORIES = [path.join(`/`, `users`, `${USER_DIR}`, `Library`)];

export class DirectoriesScan extends ProgressiveScan {
  private unscannedDirectories: string[] = [];

  public discoveredSampleDirectories: FoundSampleDirectory[] = [];

  public discoveredSamples: { dir: string; fileName: string }[] = [];

  constructor(options: { onProgressUpdate: (progress: Scan) => void }) {
    super(options.onProgressUpdate);

    this.unscannedDirectories.push(path.join(`/`, `users`, `${USER_DIR}`));
  }

  /**
   * begin the scan
   */
  public async scan(): Promise<void> {
    try {
      const nextDirToScan = this.unscannedDirectories.shift();
      if (nextDirToScan) {
        await this.scanDirectory(nextDirToScan);
        return await this.scan();
      }
      this.setFinished();
      return await Promise.resolve();
    } catch (error) {
      console.error('There was a fatal error caught scanning directories');
      return await this.scan();
    }
  }

  private async scanDirectory(directory: string): Promise<void> {
    const { fileNames, subDirs } = await subDirsAndFiles(directory);
    this.setTotal(this.total + subDirs.length);
    this.unscannedDirectories = [...this.unscannedDirectories, ...subDirs];
    const fileNamesAnalysis = analyzeFileNames(fileNames);
    if (fileNamesAnalysis) {
      const depth = directory.split(path.sep).length;
      this.discoveredSampleDirectories.push({
        path: directory,
        total: fileNamesAnalysis.amountFound,
        depth,
      });
      const foundSamples = fileNames.map((name) => ({
        dir: directory,
        fileName: name,
      }));
      this.discoveredSamples = [...this.discoveredSamples, ...foundSamples];
    }
    this.incrementProcessed(1);
  }

  /**
   * write results to database
   */
  public writeDirectoriesToDatabase() {
    Directories.addFoundSampleDirectories(this.discoveredSampleDirectories);
  }
}

async function subDirsAndFiles(dirPath: string): Promise<{
  subDirs: string[];
  fileNames: string[];
}> {
  try {
    const readDir = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const readDirNoDotFiles = filterDotFiles(readDir);
    const results: { subDirs: string[]; fileNames: string[] } = {
      subDirs: [],
      fileNames: [],
    };
    readDirNoDotFiles.forEach((entity) => {
      if (entity.isDirectory()) {
        if (IGNORED_DIRECTORIES.includes(path.join(dirPath, entity.name))) {
          console.log('ignoring..', path.join(dirPath, entity.name));
        } else {
          results.subDirs.push(path.join(dirPath, entity.name));
        }
      } else {
        results.fileNames.push(entity.name);
      }
    });
    return results;
  } catch (error) {
    console.error(`Error finding subdirectories and files inside..`, dirPath);
    console.error(error);
    if (error.name === 'EACCES') {
      return { subDirs: [], fileNames: [] };
    }
    throw error;
  }
}

function analyzeFileNames(fileNames: string[]): {
  amountFound: number;
} | null {
  const audioFiles = fileNames.filter((fileName) => {
    const { ext } = path.parse(fileName);
    return audioExts.includes(ext);
  });
  if (audioFiles.length > ENOUGH_AUDIO_FILES) {
    return {
      amountFound: audioFiles.length,
    };
  }
  return null;
}

function filterDotFiles(directoryFiles: Dirent[]): Dirent[] {
  return directoryFiles.filter((item) => !/(^|\/)\.[^/.]/g.test(item.name));
}
