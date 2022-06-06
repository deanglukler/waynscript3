import { app, BrowserWindow, shell } from 'electron';
import path from 'path';

import MenuBuilder from '../menu';
import { Channels } from '../preload';
import { AvailableWindows } from '../types';
import { resolveHtmlPath } from '../util';
import getAssetPath from './getAssetPath';
import installExtensions from './installExtensions';

export default class Windows {
  public windows: AvailableWindows = {
    queryWindow: null,
    listWindow: null,
  };

  constructor(public isDebug: boolean) {}

  private async createWindow(windowKey: keyof AvailableWindows) {
    if (this.isDebug) {
      await installExtensions();
    }

    let indexFileName = '';
    if (windowKey === 'queryWindow') {
      indexFileName = 'query.index.html';
    }
    if (windowKey === 'listWindow') {
      indexFileName = 'list.index.html';
    }

    this.windows[windowKey] = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
      },
    });

    const window = this.windows[windowKey];
    if (!window) {
      throw new Error(`window (with key: ${windowKey}) is not defined`);
    }
    window.loadURL(resolveHtmlPath(indexFileName));

    window.on('ready-to-show', () => {
      if (!window) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        window.minimize();
      } else {
        window.show();
      }
    });

    window.on('closed', () => {
      this.windows[windowKey] = null;
    });

    // Open urls in the user's browser
    window.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });

    // note: this runs every time a window opens
    // could optimize this.  But MenuBuilder needs access to this.windows
    this.buildMenu();
  }

  /**
   * createQueryWindow
   */
  public async createQueryWindow() {
    await this.createWindow('queryWindow');
    console.log('\nQuery Window Created\n');
  }

  /**
   * createListWindow
   */
  public createListWindow() {
    this.createWindow('listWindow');
  }

  /**
   * buildMenu
   */
  public buildMenu() {
    const menuBuilder = new MenuBuilder(
      this.windows,
      this.createQueryWindow.bind(this),
      this.createListWindow.bind(this)
    );
    menuBuilder.buildMenu();
  }

  /**
   * sendWindowMessage
   */
  public sendWindowMessage(
    target: keyof AvailableWindows,
    ch: Channels,
    payload: string
  ) {
    const window = this.windows[target];
    if (window == null) {
      throw new Error('IPC: Main: Target window does not exist');
    }
    window.webContents.send(ch, payload);
  }
}
