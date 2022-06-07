import { dialog, ipcMain } from 'electron';
import {
  activateDir,
  addDirectory,
  deActivateDir,
  getDirectories,
  removeDirectory,
} from '../db/directories';
import { Directory } from '../types';
import { logMainOn } from './log';

export default class Directories {
  public directories: Directory[];

  constructor() {
    this.directories = getDirectories();

    ipcMain.on('CHOOSE_DIR', (event, arg) => {
      logMainOn(arg, 'CHOOSE_DIR');
      const selectedPaths = dialog.showOpenDialogSync({
        properties: ['openDirectory', 'multiSelections'],
      });
      if (!selectedPaths) {
        throw new Error('Why no paths selected?');
      }
      const path = selectedPaths[0];

      this.addDirectory(path);
      this.replyToEventWithDirList(event);
    });

    ipcMain.on('REMOVE_DIR', (event, arg) => {
      logMainOn(arg, 'REMOVE_DIR');
      const path = arg[0];
      this.removeDirectory(path);
      this.replyToEventWithDirList(event);
    });

    ipcMain.on('SYNC_QUERY_VIEW', (event, arg) => {
      logMainOn(arg, 'SYNC_QUERY_VIEW');
      this.replyToEventWithDirList(event);
    });

    ipcMain.on('ACTIVATE_DIR', (event, arg) => {
      logMainOn(arg, 'ACTIVATE_DIR');
      const path = arg[0];
      this.activateDir(path);
      this.replyToEventWithDirList(event);
    });

    ipcMain.on('DEACTIVATE_DIR', (event, arg) => {
      logMainOn(arg, 'DEACTIVATE_DIR');
      const path = arg[0];
      this.deActivateDir(path);
      this.replyToEventWithDirList(event);
    });
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
