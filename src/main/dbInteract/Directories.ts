import {
  setViewDir,
  addDirectories,
  getDirectoriesByDepth,
} from '../db/directories';
import { FoundSampleDirectory } from '../../types';

export default class Directories {
  static getDirectoryListByDepth(depth: number) {
    return getDirectoriesByDepth(depth);
  }

  static setViewDir(id: number, view: boolean) {
    setViewDir(id, view);
  }

  static addFoundSampleDirectories(dirs: FoundSampleDirectory[]) {
    addDirectories(
      dirs.map(({ path, total, depth }) => ({
        path,
        totalSamples: total,
        depth,
      }))
    );
  }
}
