import { app, BrowserWindow, shell } from 'electron';
import _ from 'lodash';
import path from 'path';

import { getMainWindow, , updateWindow } from '../db/windows';
import { IS_DEBUG } from '../shared/constants';
import { resolveHtmlPath } from '../util';
import getAssetPath from '../utils/getAssetPath';
import installExtensions from '../utils/installExtensions';
import MenuBuilder from './MenuBuilder';

export class MainWindow {
  static async createWindow() {
    const isDebug = IS_DEBUG;
    if (isDebug) {
      await installExtensions();
    }

    return new Promise<BrowserWindow>((resolve) => {
      const indexFileName = 'index.html';
      const windowInfo = { ...getMainWindow() };

      let mainWindow: BrowserWindow | null = new BrowserWindow({
        ...windowInfo,
        show: false,
        icon: getAssetPath('icon.png'),
        webPreferences: {
          sandbox: false,
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

      mainWindow.loadURL(resolveHtmlPath(indexFileName));

      mainWindow.on('ready-to-show', () => {
        if (!mainWindow) {
          throw new Error('"mainWindow" is not defined');
        }
        mainWindow.show();
        resolve(mainWindow);
      });

      mainWindow.on('closed', () => {
        mainWindow = null;
      });

      const updateWindowBounds = (): void => {
        if (!mainWindow) {
          return console.error('mainWindow is null');
        }
        updateWindow({
          ...mainWindow.getBounds(),
          name: 'main',
        });
      };

      mainWindow.on('resized', updateWindowBounds);
      mainWindow.on('moved', _.debounce(updateWindowBounds, 500));

      // Open urls in the user's browser
      mainWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: 'deny' };
      });

      const menuBuilder = new MenuBuilder(mainWindow);
      menuBuilder.buildMenu();
    });
  }
}
