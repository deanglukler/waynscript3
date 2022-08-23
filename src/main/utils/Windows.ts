import { app, BrowserWindow, shell } from 'electron';
import _ from 'lodash';
import path from 'path';
import { getListWindow, getQueryWindow, updateWindow } from '../db/windows';

import MenuBuilder from '../menu';
import { Channels } from '../preload';
import { AvailableWindows, WindowInfo } from '../../shared/types';
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

    return new Promise<void>((resolve) => {
      let indexFileName = '';
      let windowInfo: WindowInfo = {
        width: 1024,
        height: 728,
        x: undefined,
        y: undefined,
      };
      if (windowKey === 'queryWindow') {
        indexFileName = 'query.index.html';
        windowInfo = { ...getQueryWindow() };
      }
      if (windowKey === 'listWindow') {
        indexFileName = 'list.index.html';
        windowInfo = { ...getListWindow() };
      }

      this.windows[windowKey] = new BrowserWindow({
        ...windowInfo,
        show: false,
        icon: getAssetPath('icon.png'),
        webPreferences: {
          preload: app.isPackaged
            ? path.join(__dirname, 'preload.js')
            : path.join(__dirname, '../../../.erb/dll/preload.js'),
          // the following allows howler to access files to play
          // https://www.electronjs.org/docs/latest/tutorial/security#6-do-not-disable-websecurity
          // webSecurity boolean (optional) - When false, it will disable the same-origin policy (usually using testing websites by people), and set allowRunningInsecureContent to true if this options has not been set by user. Default is true.
          webSecurity: false,
          // allowRunningInsecureContent boolean (optional) - Allow an https page to run JavaScript, CSS or plugins from http URLs. Default is false.
          allowRunningInsecureContent: false,
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
        resolve();
      });

      window.on('closed', () => {
        this.windows[windowKey] = null;
      });

      const updateWindowBounds = () => {
        updateWindow({
          ...window.getBounds(),
          name: windowKey,
        });
      };

      window.on('resized', updateWindowBounds);
      window.on('moved', _.debounce(updateWindowBounds, 500));

      // Open urls in the user's browser
      window.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: 'deny' };
      });

      // note: this runs every time a window opens
      // could optimize this.  But MenuBuilder needs access to this.windows
      this.buildMenu();
    });
  }

  /**
   * createQueryWindow
   */
  public async createQueryWindow() {
    const createPromise = await this.createWindow('queryWindow');
    console.log('\nQuery Window Created\n');
    return createPromise;
  }

  /**
   * createListWindow
   */
  public createListWindow() {
    const createPromise = this.createWindow('listWindow');
    console.log('\nList Window Created\n');
    return createPromise;
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
    payload: unknown
  ) {
    const window = this.windows[target];
    if (window == null) {
      throw new Error('IPC: Main: Target window does not exist');
    }
    window.webContents.send(ch, payload);
  }
}
