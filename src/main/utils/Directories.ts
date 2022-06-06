import {
  addDirectory,
  getDirectories,
  removeDirectory,
} from '../db/directories';
import { Directory } from '../types';

export default class Directories {
  public directories: Directory[];

  constructor() {
    this.directories = getDirectories();
  }

  private refreshDirs() {
    this.directories = getDirectories();
    console.log('\nDirs have been refreshed:');
    console.log(JSON.stringify(this.directories, null, 2));
    console.log('');
  }

  /**
   * getDirectories
   */
  public getDirectories() {
    return this.directories;
  }

  /**
   * addDirectory
   */
  public addDirectory(dirPath: string) {
    addDirectory(dirPath);
    this.refreshDirs();
  }

  /**
   * removeDirectory
   */
  public removeDirectory(dirPath: string) {
    removeDirectory(dirPath);
    this.refreshDirs();
  }
}
