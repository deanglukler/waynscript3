import {
  activateDir,
  addDirectory,
  deActivateDir,
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
   * replyToEventWithDirList
   */
  public replyToEventWithDirList(event: Electron.IpcMainEvent) {
    event.reply('DIR_LIST', this.getDirectories());
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

  /**
   * activateDir
   */
  public activateDir(dirPath: string) {
    activateDir(dirPath);
    this.refreshDirs();
  }

  /**
   * deActivateDir
   */
  public deActivateDir(dirPath: string) {
    deActivateDir(dirPath);
    this.refreshDirs();
  }
}
